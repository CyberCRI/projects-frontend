// import { StateSchema, ReducedValue /*, MemorySaver */ } from '@langchain/langgraph'
import createConversationPersistenceHandler from '@/server/projects-agent/memory/factory'
import { traceAgentMemory } from '@/server/projects-agent/tracers/trace-agent-memory'
// import useCheckpointerDb from '@/server/utils/checkpointer-db'
import type { BaseMessageChunk, ToolMessageChunk } from '@langchain/core/messages'
import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import getAgentData from '@/server/projects-agent/agent/get-agent-data'
import getMetadata from '@/server/projects-agent/agent/get-metadata'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import getAgent from '@/server/projects-agent/agent/get-agent'
import { tokenMap } from '@/server/routes/api/chat-stream'
import { v4 as uuidv4 } from 'uuid'

const runtimeConfig = useRuntimeConfig()
const { appLangchainModelName, appLangchainModelApiKey } = runtimeConfig
const { appApiOrgCode, appChatbotEnabled } = runtimeConfig.public

// TODO use own token map instead chat-stream one when refactoed
// Map conversationId to token and date for authed api requests in MCP
// export const tokenMap = new Map<string, { date: Date; token: string }>()

function sendError(code, message) {
  // setResponseStatus(event, code)
  // return {
  //   error: 'message',
  // }
  throw createError({
    statusCode: code,
    message: message,
  })
}

export default defineLazyEventHandler(() => {
  traceLangchain(
    'appChatbotEnabled:',
    appChatbotEnabled,
    'openaiApiKey:',
    !!appLangchainModelApiKey,
    'appLangchainModelModelName',
    !!appLangchainModelName
  )
  return defineEventHandler(async (event) => {
    // const { checkpointer } = await useCheckpointerDb()
    // return 404 if not configured
    if (!appLangchainModelApiKey || !appChatbotEnabled) {
      sendError(404, 'Chat is not configured')
    }

    /* -------- Check user ------------ */

    const user = await getUser(event)
    if (!user) sendError(401, 'Unauthorized')

    /* --------- Fetch Agent  --------- */

    const _id = getQuery(event)?.id
    if (!_id) sendError(400, 'Missing required "id" query parameter')

    const id = parseInt(_id as string)
    if (isNaN(id)) sendError(400, 'Wrong type for "id" query parameter')

    const agentData = await getAgentData(id)
    if (!agentData) sendError(404, 'Agent not found')

    // clean up token map as a bonus
    const now = new Date()
    for (const [key, value] of tokenMap.entries()) {
      const diff = now.getTime() - value.date.getTime()
      if (diff > 60 * 60 * 1000) {
        tokenMap.delete(key)
      }
    }

    /* --------- AuthN  --------- */

    const tokenHeader = getRequestHeader(event, 'authorization') || ''
    if (tokenHeader) {
      traceLangchain('chat-stream: got Authorization header provided')
    } else {
      traceLangchain('chat-stream: no Authorization header provided')
      sendError(401, 'Not authorized')
    }

    // check admin priviledge for preview
    if (!agentData.isEnabled) {
      traceLangchain('chat-stream: agent is disabled, checking rights to preview')
      await checkAdminRights(event)
    }

    /* --------- Response headers  --------- */

    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')
    setResponseHeader(event, 'X-Accel-Buffering', 'no')
    setResponseStatus(event, 200)

    /* --------- Conversation & TokenMap  --------- */

    const body = await readBody<{
      messages: Array<{ role: string; text: string }>
      conversationId?: string
    }>(event)

    const messages = body.messages || []

    let conversationId = body.conversationId || null
    if (conversationId) {
      // TODO: validate existence and ownership (this is done in persistance factory)
      traceLangchain('Resuming coverstion ', conversationId)
    } else {
      conversationId = uuidv4()
      traceLangchain('Starting new conversation with id:', conversationId)
    }

    traceMcp('set token map ', conversationId)
    tokenMap.set(conversationId, {
      date: new Date(),
      token: ('' + tokenHeader).replace('Bearer ', ''),
    })

    const agent = await getAgent(agentData, event, conversationId)

    /* --------- Start coversation  --------- */

    traceLangchain(
      `Starting chat stream for conversation ${conversationId}  tools and ${messages.length} incoming messages`
    )

    const persistenceHandler = await createConversationPersistenceHandler({
      threadId: conversationId,
      organizationCode: appApiOrgCode,
      userId: user.id,
      agent: agentData,
    })
    const config = {
      configurable: {
        thread_id: conversationId,
      },
      callbacks: [persistenceHandler],
      // durability: "exit", // ← one checkpoint per turn, not per superstep
    }

    const customMetadata = getMetadata(agentData, user)

    function handleFlush(event: any) {
      const res = event.node.res
      if (typeof (res as any).flush === 'function') {
        ;(res as any).flush()
      }
    }

    function respond(output: any) {
      event.node.res.write(`data: ${JSON.stringify(output)}\n\n`)
      handleFlush(event)
    }

    // TODO: fix typescript mess with agent.stream return type
    // TODO rethrow interrupt exception when chepointis enabled
    try {
      const transmitedMessages = await persistenceHandler.handleIncomingMessages(messages)

      traceAgentMemory('==========  MEMORIES  =======', persistenceHandler.messages?.length)
      traceAgentMemory(persistenceHandler.messages)
      traceAgentMemory('========== /MEMORIES =======')

      traceLangchain('==========  MESSAGES  =======', transmitedMessages?.length)
      traceLangchain(transmitedMessages)
      traceLangchain('========== /MESSAGES =======')

      for await (const [mode, chunk] of (await agent.stream(
        {
          messages: transmitedMessages,
          ...customMetadata,
        } as any,
        { ...config, streamMode: ['messages', 'tools'] }
      )) as AsyncIterableIterator<[string, any]>) {
        ///
        // if (mode != 'messages')
        //   console.log('XXXXXXXXXXXXXXXXXX', JSON.stringify(mode, null, 2), chunk.constructor.name)

        if (mode == 'tools') {
          /* HANDLE TOOLS */

          let text = ''
          let is_done = false
          let text_extra = ''
          switch (chunk.event) {
            case 'on_tool_start':
              // const { name, input, toolCallId } = chunk
              text = 'fetching_data' // 'fetching_tools' 'reasoning'
              text_extra = '👀' // chunk.input.query || ''
              break
            case 'on_tool_event':
              // const { name, data, toolCallId } = chunk
              text = 'fetching_data'
              text_extra = '✨' //''
              break
            case 'on_tool_end':
              // const { name, output, toolCallId } = chunk
              text = 'fetching_data'
              text_extra = '✅' // chunk.output
              is_done = true
              break
            case 'on_tool_error':
              // const { name, error, toolCallId } = chunk
              text = 'fetching_data'
              text_extra = '❌'
              is_done = true
              break
            default:
              console.error('Unknown tool event', chunk.event)
          }
          if (text) {
            // "fetching_tools": "Fetching tools...",
            // "fetching_data": "Fetching data...",
            // "reasoning": "Thinking...",
            // const is_done = metadata.status === 'completed'
            const role = 'meta'
            const output = {
              text,
              text_extra,
              role,
              is_done,
              conversationId,
            }
            respond(output)
          }
        } else if (mode == 'messages') {
          /* HANDLE LLM INFERENCE */

          const [token, metadata] = chunk
          if (token.lc_id[token.lc_id.length - 1] != 'AIMessageChunk') continue

          const content = token.contentBlocks || []
          const text = content
            .filter((part) => part.type == 'text')
            .map((part) => part.text)
            .join('')
          const is_done = metadata.status === 'completed'
          const role = 'ai'
          const output = {
            text,
            role,
            is_done,
            conversationId,
          }
          respond(output)
        }
      }
    } catch (err) {
      // TODO rethrow interrupt exception when chepointis enabled
      traceLangchain('Stream error:', err)
      // Extract a readable message (MCP/tool errors are often nested)
      const errorMessage =
        err?.cause?.message ?? // MCP transport errors
        err?.message ?? // standard Error
        'An unexpected error occurred'

      const output = {
        text: '',
        role: 'ai',
        is_done: true,
        conversationId,
        error: errorMessage,
      }
      respond(output)
    } finally {
      event.node.res.end()
    }
  })
})
