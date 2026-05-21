// import { StateSchema, ReducedValue /*, MemorySaver */ } from '@langchain/langgraph'
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'
import { tokenMap, traceMcp } from '@/server/routes/api/chat-stream'
import { BaseCallbackHandler } from '@langchain/core/callbacks/base'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import type { DocumentInterface } from '@langchain/core/documents'
import type { BaseMessageChunk } from '@langchain/core/messages'
import { initChatModel } from 'langchain/chat_models/universal'
import { tool, createAgent, createMiddleware } from 'langchain'
// import useCheckpointerDb from '@/server/utils/checkpointer-db'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import getVectorStore from '@/server/utils/vector-db.js'
import { ChatOpenAI } from '@langchain/openai'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'

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
  appAgentMemoryTrace,
  appVectorToolPrompt,
} = runtimeConfig
const { appApiOrgCode, appChatbotEnabled } = runtimeConfig.public

// TODO use own token map instead chat-stream one when refactoed
// Map conversationId to token and date for authed api requests in MCP
// export const tokenMap = new Map<string, { date: Date; token: string }>()

// TODO use own traceMcp map instead cgat-stream one when refactoed
// export const traceMcp = (...args) => {
//   if (appMcpServerTrace) {
//     console.log('[MCP TRACE]', ...args)
//   }
// }

export const safeStringify = (obj: unknown) => {
  const seen = new WeakSet()
  return JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    },
    2
  )
}

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

export const traceAgentMemory = (...args) => {
  if (appAgentMemoryTrace) {
    console.log('[Agent Memory TRACE]', ...args)
  }
}

// const StateAnnotation = Annotation.Root({
//   ...MessagesAnnotation.spec,
//   agent_id: Annotation<string>(),
//   keycloack_id: Annotation<string>(),
//   people_id: Annotation<string>(),
//   organization_code: Annotation<string>(),
// })

// const AgentState = new StateSchema({
//   agent_id: z.number(),
//   // keycloack_id: z.string(),
//   user_id: z.number(),
//   organization_code: z.string(),
//   // count: z.number().default(0),
//   history: new ReducedValue(
//     z.array(z.string()).default(() => []),
//     { inputSchema: z.string(), reducer: (c, n) => [...c, n] }
//   ),
// })

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
      throw createError({
        statusCode: 404,
        message: 'Chat is not configured',
      })
    }

    /* -------- Check user ------------ */

    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
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
      // TODO: validate existence and ownership
      console.log('Resuming coverstion ', conversationId)
    }

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
      traceLangchain(`Found ${agentData.skillContents.length} skills`)
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

    // function findCircular(obj: any, path = '', seen = new WeakSet()): void {
    //   if (obj && typeof obj === 'object') {
    //     if (seen.has(obj)) {
    //       console.error('[DEBUG] Circular reference at:', path)
    //       return
    //     }
    //     seen.add(obj)
    //     for (const key of Object.keys(obj)) {
    //       findCircular(obj[key], `${path}.${key}`, seen)
    //     }
    //   }
    // }
    // const debugCircularRef = createMiddleware({
    //   name: 'DebugCircularRef',
    //   beforeModel: (state) => {
    //     console.log('[DEBUG] check circular ref')
    //     findCircular(state)
    //     return
    //   },
    // })

    const loggingMiddleware = createMiddleware({
      name: 'LoggingMiddleware',
      beforeModel: (state) => {
        traceLangchain(`About to call model with ${state.messages.length} messages`)
        traceLangchain(safeStringify(state.messages))
        return
      },
      afterModel: (state) => {
        const lastMessage = state.messages[state.messages.length - 1]
        traceLangchain(`Model returned: ${lastMessage.content}`)
        return
      },
    })

    /* --------- memory ---------------- */

    class ConversationPersistenceHandler extends BaseCallbackHandler {
      name = 'ConversationPersistenceHandler'

      conversation: {
        id: string
        messages?: any[]
        [key: string]: any
      } | null = null
      lastMessage: { position: number } | null = null
      messages: any[] = []

      constructor(conversation: any) {
        super()
        this.conversation = conversation
        this.messages = conversation.messages ?? []
      }

      async updateConversation(tx: any) {
        await tx.conversation.update({
          where: { id: this.conversation!.id },
          data: {},
        })
      }

      async getLastMessage(tx?: any) {
        const lastMessage = await (tx || chatbotPrisma).conversationMessage.findFirst({
          where: { conversationId: this.conversation!.id },
          orderBy: { position: 'desc' },
          select: { position: true },
        })
        this.lastMessage = lastMessage
      }

      async getNextPosition(tx: any) {
        await this.getLastMessage(tx)
        return (this.lastMessage?.position ?? -1) + 1
      }

      async handleUserMessage(message: any) {
        traceAgentMemory('handle user message')
        if (!this.conversation?.id) {
          traceAgentMemory('No conversation set')
          return
        }
        await chatbotPrisma.$transaction(async (tx) => {
          const position = await this.getNextPosition(tx)
          await tx.conversationMessage.create({
            data: {
              conversationId: this.conversation!.id,
              role: 'user',
              content: message.content,
              position,
            },
          })
          await this.updateConversation(tx)
        })
      }

      async handleAssistantMessage(message: any) {
        await chatbotPrisma.$transaction(async (tx) => {
          const position = await this.getNextPosition(tx)
          await tx.conversationMessage.create({
            data: {
              conversationId: this.conversation!.id,
              role: 'assistant',
              content: message.content,
              toolCalls: message.tool_calls ?? null,
              position,
            },
          })
          await this.updateConversation(tx)
        })
      }

      override async handleLLMEnd(output: any) {
        traceAgentMemory('handle model end')
        if (!this.conversation?.id) {
          traceAgentMemory('No conversation set')
          return
        }
        const message = output.generations[0][0].message
        await this.handleAssistantMessage(message)
      }

      override async handleToolEnd(
        output: any,
        runId: string,
        parentRunId?: string,
        tags?: string[],
        metadata?: any
      ) {
        traceAgentMemory('handle tool end')
        if (!this.conversation?.id) {
          traceAgentMemory('No conversation set')
          return
        }
        await chatbotPrisma.$transaction(async (tx) => {
          const position = await this.getNextPosition(tx)
          await tx.conversationMessage.create({
            data: {
              conversationId: this.conversation!.id,
              role: 'tool',
              content:
                typeof output === 'string' ? output : (output?.content ?? JSON.stringify(output)),
              toolCallId: metadata?.tool_call_id ?? null,
              position,
            },
          })
          await this.updateConversation(tx)
        })
      }

      async handleRetrieverMessage(content: string, runId: string) {
        if (!content) return

        await chatbotPrisma.$transaction(async (tx) => {
          const position = await this.getNextPosition(tx)
          await tx.conversationMessage.create({
            data: {
              conversationId: this.conversation!.id,
              role: 'tool',
              content,
              toolCallId: `retriever_${runId}`,
              position,
            },
          })
          await this.updateConversation(tx)
        })
      }

      override async handleRetrieverEnd(
        documents: DocumentInterface[],
        runId: string,
        _parentRunId?: string,
        _tags?: string[]
      ) {
        traceAgentMemory('handle retriever end')
        if (!this.conversation?.id) {
          traceAgentMemory('No conversation set')
          return
        }

        const content = documents
          .map((doc, i) => {
            const source = doc.metadata?.source ?? doc.metadata?.id ?? `doc_${i}`
            return `[${source}]\n${doc.pageContent}`
          })
          .join('\n\n---\n\n')
        await this.handleRetrieverMessage(content, runId)
      }
    }

    async function createConversationPersistenceHandler({
      threadId,
      organizationCode,
      agent,
      userId,
    }: {
      threadId: string
      organizationCode: string
      agent: any
      userId: number
    }): Promise<ConversationPersistenceHandler> {
      const agentId = agent.id
      const conversationData = {
        threadId,
        organizationCode,
        userId,
        agentId,
      }
      const date = new Date().toISOString()
      const defaultConversationTitle = agent.title + ' - ' + date

      let conversation = await chatbotPrisma.conversation.findUnique({
        include: { messages: { orderBy: { position: 'asc' } } },
        where: conversationData,
      })

      if (!conversation) {
        traceAgentMemory('Create new conversation')
        const created = await chatbotPrisma.conversation.create({
          data: {
            ...conversationData,
            title: defaultConversationTitle,
            titleSource: 'fallback',
          },
        })
        conversation = { ...created, messages: [] }
      }

      const persistenceHandler = new ConversationPersistenceHandler(conversation)
      await persistenceHandler.getLastMessage()
      return persistenceHandler
    }

    /* --------- LLM settings  --------- */

    const parsedTemperature = parseFloat(appLangchainTemperature)
    const temperature = Number.isNaN(parsedTemperature) ? 0.7 : parsedTemperature

    let model

    // fix circular ref bug in state
    // see https://github.com/langchain-ai/langchainjs/issues/9572
    if (/^openai:/.test(appLangchainModelName)) {
      model = new ChatOpenAI({
        model: appLangchainModelName.replace(/^openai:/, ''),
        temperature,
        apiKey: appLangchainModelApiKey,
      })
    } else {
      // fallback for non openai models and keep for when circular ref bug is resolved
      model = await initChatModel(appLangchainModelName, {
        temperature,
        apiKey: appLangchainModelApiKey,
      })
    }

    /* --------- Agent setup  --------- */

    const agent = createAgent({
      model,
      tools,
      // TODO reanble checkpoint after tests
      // checkpointer,
      systemPrompt: new SystemMessage({
        content: [
          {
            type: 'text',
            text: agentData.promptContent.content + skillSystemPromptExtra,
          },
        ],
      }),
      // stateSchema: AgentState as StateSchema<any>,
      middleware: [
        toolMonitoringMiddleware,
        loggingMiddleware,
        // debugCircularRef,
        // contextEditingMiddleware({
        //   // TODO: make configurable in agent data{
        //   edits: [
        //     new ClearToolUsesEdit({
        //       triggerTokens: 1000, // 10_000, // 1 ingle-spaced page ~= 3500 chars
        //       keep: 3, // keep at least n tool call
        //     }),
        //   ],
        // }),
        // summarizationMiddleware({
        //   // TODO: make configurable in agent data
        //   model, // TODO: make model independent from agent  model
        //   trigger: { tokens: 1600 }, // 16_000 }, // 1 ingle-spaced page ~= 3500 chars
        //   keep: { messages: 4 }, // 42 },
        // }),
      ] as any,
    })

    /* --------- Start coversation  --------- */

    traceLangchain(
      `Starting chat stream for conversation ${conversationId} with ${tools.map((t) => `"${t.name}"`).join(', ')}  tools and ${messages.length} messages`
    )

    // console.log('[MEATAFA]', {
    //   agent_id: agentData.id,
    //   keycloack_id: user.keycloack_id,
    //   people_id: user.people_id,
    //   organization_code: appApiOrgCode,
    // })
    //
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

    // console.log('================ HISTORY =================')
    // console.log(JSON.stringify(persistenceHandler.messages, null, 2))
    // console.log('================== NEW MESSSAGES ===========')
    // console.log(JSON.stringify(messages, null, 2))
    // console.log('=================================')

    for (const message of messages) {
      if (message.role === 'user') {
        traceAgentMemory('Saving last human message:', message.text)
        if (message.text) await persistenceHandler.handleUserMessage({ content: message.text })
      } else if (message.role === 'assistant') {
        traceAgentMemory('Saving last assistant message:', message.text)
        if (message.text) await persistenceHandler.handleAssistantMessage({ content: message.text })
      } else if (message.role === 'retriever') {
        // handle "user profile" stuffed. TODO: make a real server side tool
        traceAgentMemory('Saving last retriever message:', message.text)
        if (message.text)
          await persistenceHandler.handleRetrieverMessage(message.text, `user_context_${uuidv4()}`)
      }
    }

    const customMetadata = {
      agent_id: agentData.id,
      // keycloack_id: user.keycloack_id,
      user_id: user.id,
      organization_code: appApiOrgCode,
    }

    function memoryFilter(msg) {
      // deliberatly ignore tool to mininimize context
      // TODO: if required, re-enable tool messages
      return (
        (msg.role != 'tool' || msg.toolCallId?.startsWith('retriever_user_context')) && msg.content
      )
    }

    function memoryMapper(msg) {
      // langchanin doenst support tool message ithout correponding ai tool call
      // but we disguise user context as tool result
      // so revert back to a pseudo 'assistant' message
      // TODO: fix when context is done server side tool
      if (msg.role === 'tool' && msg.toolCallId?.startsWith('retriever_user_context')) {
        msg.role = 'assistant'
      }
      return msg.role === 'ai' || msg.role === 'assistant'
        ? new AIMessage(msg.content) // langchaine (and memory) use "content", deep-chat uses "text"
        : new HumanMessage(msg.content) // langchaine (and memory) use "content", deep-chat uses "text"
    }

    function messageMapper(msg) {
      return msg.role === 'ai' || msg.role === 'assistant'
        ? new AIMessage(msg.text) // langchaine (and memory) use "content", deep-chat uses "text"
        : new HumanMessage(msg.text) // langchaine (and memory) use "content", deep-chat uses "text"
    }

    // TODO: fix typescript mess with agent.stream return type
    try {
      for await (const [token, metadata] of (await agent.stream(
        {
          messages: [
            ...(persistenceHandler.messages || []).filter(memoryFilter).map(memoryMapper),
            ...messages.map(messageMapper),
          ],

          ...customMetadata,
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
