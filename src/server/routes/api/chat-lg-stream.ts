// import OpenAI from 'openai'
// import { ChatOpenAI } from '@langchain/openai'
import { initChatModel } from 'langchain/chat_models/universal'
import { createAgent, createMiddleware } from 'langchain'
import { MemorySaver } from '@langchain/langgraph'
import { SystemMessage, HumanMessage, AIMessage, BaseMessageChunk } from '@langchain/core/messages'
import { v4 as uuidv4 } from 'uuid'
import getVectorStore from '@/server/utils/vector-db.js'
// import { tool } from '@langchain/core/tools'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'

import { tokenMap, traceMcp } from '@/server/routes/api/chat-stream'

const runtimeConfig = useRuntimeConfig()
const {
  // appOpenaiApiPromptId,
  // appOpenaiApiPromptVersion,
  appLangchainModelName,
  appLangchainModelApiKey,
  appLangchainTemperature,
  // appOpenaiApiVectorStoreId,
  appMcpServerUrl,
  // appMcpServerTrace,
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
      setResponseStatus(event, 404)
      return
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
    if (!conversationId) {
      // if no conversationId, we start a new conversation
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
      // tools.push({
      //   type: 'mcp',
      //   server_label: 'projects-local-mcp',
      //   server_description:
      //     'A MCP to fetch information about projects, people and groups on this Projects platform.',
      //   server_url: appMcpServerUrl,
      //   require_approval: 'never',
      //   authorization: conversationId,
      // })

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

    // if (appOpenaiApiVectorStoreId) {
    //   tools.push({
    //     // name: 'openai_vectorstore',
    //     type: 'file_search',
    //     vector_store_ids: [appOpenaiApiVectorStoreId],
    //   })
    // }

    const { vectorStore } = await getVectorStore()
    if (vectorStore) {
      const { appApiOrgCode } = useRuntimeConfig().public
      traceLangchain(`Configure vector tool with prompt "${appVectorToolPrompt}"`)
      const retriever = vectorStore.asRetriever({
        k: 5,
        filter: {
          orgCode: appApiOrgCode,
        },
      }) // Top 4 similar docs
      // Create tool from retriever
      // const retrieverTool = tool(
      //   async (query) => {
      //     console.log(query)
      //     const docs = await retriever.invoke(query)
      //     return docs.map((doc: Document) => doc.pageContent).join('\n\n')
      //   },
      //   {
      //     name: 'pgvector_search',
      //     type: 'file_search',
      //     // description: 'Search for information in the document database. Use this tool when you need to answer questions about the uploaded content.',
      //     description: appVectorToolPrompt,
      //     schema: {
      //       type: 'object',
      //       properties: {
      //         query: {
      //           type: 'string',
      //           description: 'Search query',
      //         },
      //       },
      //       required: ['query'],
      //     },
      //     require_approval: 'never',
      //   }
      // )
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

    /*
      EXEMPLE OUTUT PUT TOKENS:

      {
      "type": "text",
      "index": 0,
      "text": " learning"
      }
      ][
      {
      "type": "text",
      "index": 0,
      "text": " environments"
      }
      ][
      {
      "type": "text",
      "index": 0,
      "text": "",
      "annotations": [
      {
      "type": "citation",
      "source": "file_citation",
      "title": "FAQ - THE PROVEST PROJECT CONTEXT.txt",
      "startIndex": 522,
      "file_id": "file-R1phfjqpukKyqdBHFNRhm2"
      }
      ]
      }
      ]
  */
    // TODO: fix typescript mess with agent.stream return type
    for await (const [token, metadata] of (await agent.stream(
      // { messages: messages.map((msg) => new HumanMessage(msg.text)) } as any,
      {
        messages: messages.map((msg) =>
          msg.role === 'ai' || msg.role === 'assistant'
            ? new AIMessage(msg.text)
            : new HumanMessage(msg.text)
        ),
      } as any,
      { ...config, streamMode: 'messages' }
      // ,{ options: { stream: true }, previous_response_id: conversationId,}
    )) as AsyncIterableIterator<[BaseMessageChunk, { status: string; langgraph_node?: any }]>) {
      // TODO: handle tools and reaoning chunks
      // console.log('chunk from lg node', metadata.langgraph_node)
      // console.log('-----------------------------')
      // console.log('--METADATA chunk from lg node\n', JSON.stringify(metadata, null, 2))
      // console.log('-----------------------------')
      // console.log('--TOKEN chunk from lg node\n', JSON.stringify(token, null, 2))
      // console.log('-----------------------------')

      // console.log(
      //   '-----> TOKEN ID\n',
      //   token.constructor.name,
      //   (token.lc_id && token.lc_id.join && token.lc_id.join(', ')) || token.lc_id
      // )
      // console.log('-----> META NODE STEP\n', metadata.langgraph_node, metadata.langgraph_step)

      // console.log('---->', token.contentBlocks.map((b) => b.type).join(', '))

      // prevent writing tool message to front
      if (token.lc_id[token.lc_id.length - 1] != 'AIMessageChunk') continue

      const content = token.contentBlocks || []
      // sort in ascending index order and join texts (is it really necessary ?)
      // const ordered_content = content.sort((a: int, b: int) => a.index - b.index)
      // const text = ordered_content
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
