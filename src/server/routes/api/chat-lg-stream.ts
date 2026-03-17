// import OpenAI from 'openai'
import { ChatOpenAI } from '@langchain/openai'
import { createAgent, createMiddleware } from 'langchain'
import { MemorySaver } from '@langchain/langgraph'
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import { v4 as uuidv4 } from 'uuid'
import getVectorStore from '@/server/utils/vector-db.js'
// import { tool } from '@langchain/core/tools'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'

const runtimeConfig = useRuntimeConfig()
const {
  // appOpenaiApiPromptId,
  // appOpenaiApiPromptVersion,
  appOpenaiApiKey,
  // appOpenaiApiVectorStoreId,
  appMcpServerUrl,
  appMcpServerTrace,
  appSorbobotApiTrace,
  appLangchainPrompt,
  appVectorToolPrompt,
} = runtimeConfig
const { appChatbotEnabled } = runtimeConfig.public

// Map conversationId to token and date for authed api requests in MCP
export const tokenMap = new Map<string, { date: Date; token: string }>()
export const checkpointer = new MemorySaver()

export const traceMcp = (...args) => {
  if (appMcpServerTrace) {
    console.log('[MCP TRACE]', ...args)
  }
}

export const traceSorbobot = (...args) => {
  if (appSorbobotApiTrace) {
    console.log('[Sorbobot TRACE]', ...args)
  }
}

export default defineLazyEventHandler(() => {
  console.log('appChatbotEnabled:', appChatbotEnabled, 'openaiApiKey:', !!appOpenaiApiKey)
  return defineEventHandler(async (event) => {
    // return 404 if not configured
    if (!appOpenaiApiKey || !appChatbotEnabled) {
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

    // TODO handle conversation on our side
    // const openai = new OpenAI({
    //   apiKey: appOpenaiApiKey,
    // })
    let conversationId = body.conversationId || null
    if (!conversationId) {
      // if no conversationId, we start a new conversation
      conversationId = uuidv4()
      console.log('Starting new conversation with id:', conversationId)
    }

    const tools = []

    if (appMcpServerUrl) {
      traceMcp('Adding MCP tool with server URL:', appMcpServerUrl)
      tools.push({
        type: 'mcp',
        server_label: 'projects-local-mcp',
        server_description:
          'A MCP to fetch information about projects, people and groups on this Projects platform.',
        server_url: appMcpServerUrl,
        require_approval: 'never',
        authorization: conversationId,
      })
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
      console.log(`Configure vector tool with prompt "${appVectorToolPrompt}"`)
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
        console.log(`Executing tool: ${request.toolCall.name}`)
        console.log(`Arguments: ${JSON.stringify(request.toolCall.args)}`)
        try {
          const result = await handler(request)
          console.log(
            `Tool completed successfully: "${result.content.substring(0, 100)}${result.content.length > 100 ? ' (...)' : ''}"`
          )
          return result
        } catch (e) {
          console.log(`Tool failed: ${e}`)
          throw e
        }
      },
    })

    const model = appOpenaiApiKey
      ? new ChatOpenAI({
          apiKey: appOpenaiApiKey,
          model: 'gpt-4o-mini',
          temperature: 0.2,
        })
      : null

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
      middleware: [toolMonitoringMiddleware] as any,
    })

    traceMcp(
      `Starting chat stream for conversation ${conversationId} with ${tools.map((t) => `"${t.name}"`).join(', ')}  tools and ${messages.length} messages`
    )

    tokenMap.set(conversationId, {
      date: new Date(),
      token: ('' + tokenHeader).replace('Bearer ', ''),
    })
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
    )) as AsyncIterableIterator<
      [
        {
          contentBlocks?: Array<{ type: string; index: number; text: string }>
        },
        { status: string; langgraph_node?: any },
      ]
    >) {
      // TODO: handle tools and reaoning chunks
      // console.log('chunk from lg node', metadata.langgraph_node)
      const content = token.contentBlocks || []
      // sort in ascending index order and join texts (is it really necessary ?)
      const ordered_content = content.sort((a, b) => a.index - b.index)
      const text = ordered_content
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
