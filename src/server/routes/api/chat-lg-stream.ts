import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'
import type { BaseMessageChunk } from '@langchain/core/messages'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { MemorySaver } from '@langchain/langgraph'

import { tokenMap, traceMcp } from '~/server/routes/api/chat-stream'
import { initChatModel } from 'langchain/chat_models/universal'
import { createAgent, createMiddleware } from 'langchain'
import getVectorStore from '~/server/utils/vector-db.js'
import { v4 as uuidv4 } from 'uuid'

const runtimeConfig = useRuntimeConfig()
const {
  appLangchainModelName,
  appLangchainModelApiKey,
  appLangchainTemperature,
  appMcpServerUrl,
  appLangchainTrace,
  appSorbobotApiTrace,
  appLangchainPrompt,
  appVectorToolPrompt,
} = runtimeConfig
const { appChatbotEnabled } = runtimeConfig.public

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
    if (!appLangchainModelApiKey || !appLangchainModelName || !appChatbotEnabled) {
      throw createError({
        statusCode: 404,
        message: 'Chat is not configured',
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

    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')
    setResponseStatus(event, 200)

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

    const tools = []

    if (appMcpServerUrl) {
      traceMcp('Adding MCP tool with server URL:', appMcpServerUrl)
      const client = new MultiServerMCPClient({
        mcp: {
          transport: 'http', // HTTP-based remote server
          url: appMcpServerUrl,
          headers: {
            Authorization: `${conversationId}`,
          },
        },
      })

      const mcpTools = await client.getTools()
      traceMcp('mcp tool', JSON.stringify(mcpTools, null, 2))
      tools.unshift(...mcpTools)
    }

    const { vectorStore } = await getVectorStore()
    if (vectorStore) {
      const { appApiOrgCode } = useRuntimeConfig().public
      traceLangchain(`Configure vector tool with prompt "${appVectorToolPrompt}"`)
      const retriever = vectorStore.asRetriever({
        k: 5,
        filter: {
          orgCode: appApiOrgCode,
        },
      })

      const retrieverTool = createRetrieverTool(retriever, {
        name: 'pgvector_tool',
        description: appVectorToolPrompt,
      })
      tools.push(retrieverTool)
    }

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

    const parsedTemperature = parseFloat(appLangchainTemperature)
    const temperature = Number.isNaN(parsedTemperature) ? 0.7 : parsedTemperature

    const model = await initChatModel(appLangchainModelName, {
      temperature,
      apiKey: appLangchainModelApiKey,
    })

    const agent = createAgent({
      model,
      tools,
      checkpointer,
      systemPrompt: new SystemMessage({
        content: [
          {
            type: 'text',
            text: appLangchainPrompt,
          },
        ],
      }),
      middleware: [toolMonitoringMiddleware, loggingMiddleware] as any,
    })

    traceMcp(
      `Starting chat stream for conversation ${conversationId} with ${tools.map((t) => `"${t.name}"`).join(', ')}  tools and ${messages.length} messages`
    )

    const config = {
      configurable: { thread_id: conversationId },
    }

    // TODO: fix typescript mess with agent.stream return type
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
    }

    event.node.res.end()
  })
})
