import { initChatModel } from 'langchain/chat_models/universal'
import { tool, createAgent, createMiddleware } from 'langchain'
import * as z from 'zod'
import { MemorySaver } from '@langchain/langgraph'
import { SystemMessage, HumanMessage, AIMessage, BaseMessageChunk } from '@langchain/core/messages'
import { v4 as uuidv4 } from 'uuid'
import getVectorStore from '@/server/utils/vector-db.js'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'
import { tokenMap, traceMcp } from '@/server/routes/api/chat-stream'

// TODO: fix import issue (useNuxtRuntime in dependncies)
// import { PROJECTS_DEFAULT_VECTOR_STORE_KEY } from '@/composables/useVectorStore'
const PROJECTS_DEFAULT_VECTOR_STORE_KEY = 'ProjectsDefaultVectorStoreKey'
const runtimeConfig = useRuntimeConfig()
const {
  appLangchainModelName,
  appLangchainModelApiKey,
  appLangchainTemperature,
  appMcpServerUrl,
  appLangchainTrace,
  appSorbobotApiTrace,
  appVectorToolPrompt,
} = runtimeConfig
const { appApiOrgCode, appChatbotEnabled } = runtimeConfig.public

// TODO use own token map instead chat-stream one when refactoed
// Map conversationId to token and date for authed api requests in MCP
// export const tokenMap = new Map<string, { date: Date; token: string }>()

export const checkpointer = new MemorySaver()

// TODO use own traceMcp map instead cgat-stream one when refactoed
// export const traceMcp = (...args) => {
//   if (appMcpServerTrace) {
//     console.log('[MCP TRACE]', ...args)
//   }
// }

export const traceLangchain = (...args) => {
  if (appLangchainTrace) {
    console.log('[LangChain TRACE]', ...args)
  }
}

export const traceSorbobot = (...args) => {
  if (appSorbobotApiTrace) {
    console.log('[Sorbobot TRACE]', ...args)
  }
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
    // return 404 if not configured
    if (!appLangchainModelApiKey || !appChatbotEnabled) {
      throw createError({
        statusCode: 404,
        message: 'Chat is not configured',
      })
    }

    /* --------- Fetch Agent  --------- */

    const _id = getQuery(event)?.id
    if (!_id) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }
    const id = parseInt(_id as string)
    if (isNaN(id)) {
      setResponseStatus(event, 400)
      return {
        error: 'Wrong type for "id" query parameter',
      }
    }
    const agentData = await chatbotPrisma.agent.findUnique({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: {
          include: { prompt: true },
        },
        skillContents: { include: { skillContent: { include: { skill: true } } } },
        documents: true,
        mcps: true,
      },
    })

    if (!agentData) {
      throw createError({
        statusCode: 404,
        message: 'Agent not found',
      })
    }
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
      traceMcp('chat-stream: got Authorization header provided')
    } else {
      traceMcp('chat-stream: no Authorization header provided')
      throw createError({
        statusCode: 401,
        message: 'Not authorized',
      })
    }

    // check admin priviledge for preview
    if (!agentData.isEnabled) {
      traceMcp('chat-stream: agent is diabled, checking rights to preview')
      await checkSuperAdminRights(event)
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
    // if no conversationId, we start a new conversation
    if (!conversationId) {
      conversationId = uuidv4()
      traceLangchain('Starting new conversation with id:', conversationId)
    }

    traceMcp('set token map ', conversationId)
    tokenMap.set(conversationId, {
      date: new Date(),
      token: ('' + tokenHeader).replace('Bearer ', ''),
    })

    /* --------- MCPs  --------- */

    const tools = []

    if (agentData.useProjectsMcp || agentData.mcps.length) {
      const mcpConfigs = {}

      if (agentData.useProjectsMcp) {
        traceMcp('Adding projects MCP')
        mcpConfigs['projects-mcp'] = {
          // TODO use stdio or diect tool instead a mcp
          transport: 'http', // HTTP-based remote server
          url: appMcpServerUrl,
          headers: {
            Authorization: `${conversationId}`,
          },
        }
      }

      agentData.mcps.forEach((mcp) => {
        const aConfig = {
          transport: mcp.transport,
        }
        if (mcp.transport == 'stdio') {
          aConfig['command'] = mcp.command
          aConfig['args'] = mcp.args
          traceMcp('Adding MCP tool with command:', mcp.command, mcp.args)
        } else {
          aConfig['url'] = mcp.url
          traceMcp('Adding MCP tool with server URL:', mcp.url)
          // TODO: auth
        }

        const slug = mcp.title.replace(/\s+/gim, '_')

        mcpConfigs[slug] = aConfig
      })

      const client = new MultiServerMCPClient(mcpConfigs)

      // TODO: add middlkewrae to select tools
      const mcpTools = await client.getTools()
      traceMcp('mcp tool', JSON.stringify(mcpTools, null, 2))
      event.node.res.on('close', () => {
        client.close().catch(() => {})
      })
      tools.unshift(...mcpTools)
    }

    /* --------- Skills  --------- */

    let skillSystemPromptExtra = ''
    if (agentData.skillContents.length) {
      console.log(`Found ${agentData.skillContents.length} skills`)
      const skillMap = {}
      agentData.skillContents.forEach((agentSkillContent) => {
        const skillContent = agentSkillContent.skillContent
        const skillTitle = skillContent.skill.title
        const skillSlug = skillTitle.replace(/\s+/gim, '_')
        skillMap[skillSlug] = {
          description: skillContent.skill.description,
          content: skillContent.content,
        }
      })

      skillSystemPromptExtra = `
        You have access to ${agentData.skillContents.length} skills:
        ${Object.keys(skillMap).join(', ')}.
        Use load_skill tool to access them.`

      const loadSkill = tool(
        async ({ skillName }) => {
          console.log(`Fetching skil ${skillName}`)
          // Load skill content from file/database
          return skillMap[skillName]?.content || ''
        },
        {
          name: 'load_skill',
          description: `Load a specialized skill.

      Available skills:
      ${Object.entries(skillMap)
        .map(([key, val]) => '- ' + key + ': ' + (val as any).description)
        .join('\n')}

      Returns the skill's prompt and context.`,
          schema: z.object({
            skillName: z.string().describe('Name of skill to load'),
          }),
        }
      )

      tools.unshift(loadSkill)
    }

    /* --------- Vector Stores  --------- */

    // TODO: set vector store iu agent ?
    const { vectorStore } = await getVectorStore()
    if (vectorStore) {
      traceLangchain(`Configure vector tool with prompt "${appVectorToolPrompt}"`)

      const agentDocuments = (agentData.documents || [])
        .filter((d) => d.vectorStoreKey === PROJECTS_DEFAULT_VECTOR_STORE_KEY)
        .map((d) => d.documentTitle)

      const retriever = vectorStore.asRetriever({
        k: 5,
        filter: {
          orgCode: appApiOrgCode,
          title: { $in: agentDocuments },
        },
      })

      const retrieverTool = createRetrieverTool(retriever, {
        name: 'pgvector_tool',
        description: appVectorToolPrompt,
      })
      tools.push(retrieverTool)
    }

    /* --------- Loggers  --------- */

    const toolMonitoringMiddleware = createMiddleware({
      name: 'ToolMonitoringMiddleware',
      wrapToolCall: async (request, handler) => {
        traceLangchain(`Executing tool: ${request.toolCall.name}`)
        traceLangchain(`Arguments: ${JSON.stringify(request.toolCall.args)}`)
        try {
          const result = await handler(request)
          const content: string = (result as { content: string }).content
          traceLangchain(
            `Tool completed successfully: "${content.substring(0, 100)}${content.length > 100 ? ' (...)' : ''}"`
          )
          return result
        } catch (e) {
          traceLangchain(`Tool failed: ${e}`)
          throw e
        }
      },
    })

    const loggingMiddleware = createMiddleware({
      name: 'LoggingMiddleware',
      beforeModel: (state) => {
        traceLangchain(`About to call model with ${state.messages.length} messages`)
        traceLangchain(JSON.stringify(state.messages, null, 2))
        return
      },
      afterModel: (state) => {
        const lastMessage = state.messages[state.messages.length - 1]
        traceLangchain(`Model returned: ${lastMessage.content}`)
        return
      },
    })

    /* --------- LLM settings  --------- */

    const parsedTemperature = parseFloat(appLangchainTemperature)
    const temperature = Number.isNaN(parsedTemperature) ? 0.7 : parsedTemperature

    const model = await initChatModel(appLangchainModelName, {
      temperature,
      apiKey: appLangchainModelApiKey,
    })

    /* --------- Agent setup  --------- */

    const agent = createAgent({
      model,
      tools,
      checkpointer,
      systemPrompt: new SystemMessage({
        content: [
          {
            type: 'text',
            text: agentData.promptContent.content + skillSystemPromptExtra,
          },
        ],
      }),
      middleware: [toolMonitoringMiddleware, loggingMiddleware] as any,
    })

    /* --------- Start coversation  --------- */

    traceMcp(
      `Starting chat stream for conversation ${conversationId} with ${tools.map((t) => `"${t.name}"`).join(', ')}  tools and ${messages.length} messages`
    )

    const config = {
      configurable: { thread_id: conversationId },
    }

    // TODO: fix typescript mess with agent.stream return type
    try {
      for await (const [token, metadata] of (await agent.stream(
        {
          messages: messages.map((msg) =>
            msg.role === 'ai' || msg.role === 'assistant'
              ? new AIMessage(msg.text)
              : new HumanMessage(msg.text)
          ),
        } as any,
        { ...config, streamMode: 'messages' }
      )) as AsyncIterableIterator<[BaseMessageChunk, { status: string; langgraph_node?: any }]>) {
        // prevent writing tool message to front
        if (token.lc_id[token.lc_id.length - 1] != 'AIMessageChunk') continue

        const content = token.contentBlocks || []
        const text = content
          .filter((part) => part.type == 'text')
          .map((part) => part.text)
          .join('')
        const is_done = metadata.status === 'completed'
        const role = 'ai'
        event.node.res.write(
          `data: ${JSON.stringify({
            text,
            role,
            is_done,
            conversationId,
          })}\n\n`
        )
        if (typeof (event.node.res as any).flush === 'function') {
          ;(event.node.res as any).flush()
        }
      }
    } catch (err) {
      traceLangchain('Stream error:', err)
    } finally {
      event.node.res.end()
    }
  })
})
