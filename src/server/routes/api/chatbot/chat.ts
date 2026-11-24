// import { StateSchema, ReducedValue /*, MemorySaver */ } from '@langchain/langgraph'
import {
  statusKey,
  thinkingEvent,
  toolChunkToStatusEvent,
  type StatusEvent,
} from '@/server/projects-agent/utils/status-event'
import createConversationPersistenceHandler from '@/server/projects-agent/memory/factory'
import { traceAgentMemory } from '@/server/projects-agent/tracers/trace-agent-memory'
import checkAdminRights, { getUser } from '@/server/utils/check-admin-rights.js'
// import useCheckpointerDb from '@/server/utils/checkpointer-db'
// import type { BaseMessageChunk, ToolMessageChunk } from '@langchain/core/messages'
import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import getAgentData from '@/server/projects-agent/agent/get-agent-data'
import getMetadata from '@/server/projects-agent/agent/get-metadata'
// import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import getAgent from '@/server/projects-agent/agent/get-agent'
import { tokenMap } from '@/server/routes/api/chat-stream'
import { v4 as uuidv4 } from 'uuid'

import filterSpecialTagFactory from '~/server/utils/filter-special-tag'

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

    // traceMcp('set token map ', conversationId)
    // tokenMap.set(conversationId, {
    //   date: new Date(),
    //   token: ('' + tokenHeader).replace('Bearer ', ''),
    // })

    const agent = await getAgent(agentData, event, tokenHeader)

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

    const filterSpecialTag = filterSpecialTagFactory()
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

      let last_role = 'ai'
      let lastStatus = ''

      // send a status ("meta") event, skipping consecutive duplicates
      const sendStatus = (statusEvent: StatusEvent | null) => {
        if (!statusEvent) return
        const key = statusKey(statusEvent)
        if (key === lastStatus) return
        lastStatus = key
        last_role = 'meta'
        respond(statusEvent)
      }

      // fill the dead air before the first token
      sendStatus(thinkingEvent(conversationId))

      for await (const [mode, chunk] of (await agent.stream(
        {
          messages: transmitedMessages,
          ...customMetadata,
        } as any,
        { ...config, streamMode: ['messages', 'tools' /*, 'updates' */] }
      )) as AsyncIterableIterator<[string, any]>) {
        if (mode == 'tools') {
          /* HANDLE TOOLS (single source of truth for tool status) */
          const statusEvent = toolChunkToStatusEvent(chunk, conversationId)
          if (!statusEvent) {
            if (!['on_tool_event'].includes(chunk?.event)) {
              console.error('Unknown tool event', chunk?.event)
            }
            continue
          }
          sendStatus(statusEvent)
          // once a tool is over, the model reads its result: back to "thinking"
          if (statusEvent.status !== 'start') {
            lastStatus = ''
            sendStatus(thinkingEvent(conversationId))
          }
        } else if (mode == 'messages') {
          /* HANDLE LLM INFERENCE */
          const [token] = chunk

          const tokenClass = token.lc_id?.[token.lc_id.length - 1]
          // Only AIMessageChunk matter here: tool calls and tool results are
          // reported by the 'tools' stream mode.
          if (tokenClass !== 'AIMessageChunk') continue
          // AI is deciding to call a tool (no text): handled by 'tools' mode
          if (token.tool_call_chunks?.length > 0) continue

          const content = token.contentBlocks || []

          // reasoning / thinking blocks are never shown, but tell the user
          if (content.some((part) => part.type === 'reasoning' || part.type === 'thinking')) {
            sendStatus(thinkingEvent(conversationId))
          }

          const text = filterSpecialTag(
            content
              .filter((part) => part.type == 'text')
              .map((part) => part.text)
              .join('')
          )
          // no empty chunks (they would reset the status bubble for nothing)
          if (!text) continue

          const role = 'ai'
          last_role = role
          lastStatus = ''
          respond({ text, role, is_done: false, conversationId })
        }
      }
      // This is the authoritative "agent is done" signal
      // (openai had 'is_done:true' on last chunk but other providers don't)
      respond({ text: '', role: last_role, is_done: true, conversationId })
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
