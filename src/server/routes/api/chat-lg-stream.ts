// import OpenAI from 'openai'
import { ChatOpenAI } from '@langchain/openai'
import { v4 as uuidv4 } from 'uuid'
const runtimeConfig = useRuntimeConfig()
const {
  // appOpenaiApiPromptId,
  // appOpenaiApiPromptVersion,
  appOpenaiApiKey,
  appOpenaiApiVectorStoreId,
  appMcpServerUrl,
  appMcpServerTrace,
  appSorbobotApiTrace,
  appLangchainPrompt,
} = runtimeConfig
const { appChatbotEnabled } = runtimeConfig.public

// Map conversationId to token and date for authed api requests in MCP
export const tokenMap = new Map<string, { date: Date; token: string; conversation: any[] }>()

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

    if (appOpenaiApiVectorStoreId) {
      tools.push({
        type: 'file_search',
        vector_store_ids: [appOpenaiApiVectorStoreId],
      })
    }
    const chatbot = appOpenaiApiKey
      ? new ChatOpenAI({
          apiKey: appOpenaiApiKey,
          model: 'gpt-4o-mini',
          temperature: 0,
        }).bindTools(tools)
      : null

    traceMcp(
      `Starting chat stream for conversation ${conversationId} with ${messages.length} messages`
    )

    const adaptedMessages = [
      { role: 'system', content: appLangchainPrompt },
      ...messages.map((message) => {
        return {
          role: message.role,
          content: message.text,
        }
      }),
    ]

    tokenMap.set(conversationId, {
      date: new Date(),
      token: ('' + tokenHeader).replace('Bearer ', ''),
      conversation: adaptedMessages,
    })

    // const prompt = {
    //   id: appOpenaiApiPromptId,
    // }
    // if (appOpenaiApiPromptVersion) {
    //   prompt['version'] = String(appOpenaiApiPromptVersion)
    // }

    // const requestOptions: any = {
    //   prompt,
    //   //store: false, // do not store in OpenAI's servers, we do this on client side
    //   store: true, // we want to store it to be able to use follow-up questions
    //   input: adaptedMessages, // [{ role: 'user', content: messages[0].content }]
    //   conversation: conversationId,
    //   reasoning: {},
    //   tools: [],
    //   stream: true,
    // }

    const stream: any = await chatbot.stream(adaptedMessages as any, {
      // options: { stream: true },
      // previous_response_id: conversationId,
    })

    for await (const chunk of stream) {
      console.log('CHAT STREAM CHUNK:', chunk.type)

      // TODO: handle other chunk types (like error)
      if (chunk.type === 'response.output_text.delta') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: chunk.delta,
            role: 'assistant',
            is_done: false,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.output_text.done') {
        event.node.res.write(
          // hackish: we send empty text so deepchat doesnt rerender it again
          // and done_text with complete response to add to conversation history
          `data: ${JSON.stringify({
            text: '',
            done_text: chunk.text,
            role: 'assistant',
            is_done: true,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.mcp_list_tools.in_progress') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'fetching_tools',
            role: 'meta',
            is_done: false,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.mcp_list_tools.completed') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'fetching_tools',
            role: 'meta',
            is_done: true,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.mcp_call.in_progress') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'fetching_data',
            role: 'meta',
            is_done: false,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.mcp_call.completed') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'fetching_data',
            role: 'meta',
            is_done: true,
            conversationId: conversationId,
          })}\n\n`
        )
        // Reasoning
      } else if (chunk.type === 'response.reasoning_summary_part.added') {
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'reasoning',
            role: 'meta',
            is_done: false,
            conversationId: conversationId,
          })}\n\n`
        )
      } else if (chunk.type === 'response.reasoning_summary_part.done') {
        // console.log(JSON.stringify(chunk, null, 2))
        event.node.res.write(
          `data: ${JSON.stringify({
            text: 'reasoning',
            role: 'meta',
            is_done: true,
            conversationId: conversationId,
          })}\n\n`
        )
      } else {
        console.log('Unhandled chat stream chunk type:', chunk)
      }

      if (chunk.type === 'ai') {
        const { content, response_metadata } = chunk
        // sort in ascending index order and join texts
        const ordered_content = content.sort((a, b) => a.index - b.index)
        const text = ordered_content
          .filter((part) => part.type == 'text')
          .map((part) => part.text)
          .join('')
        const is_done = response_metadata.status === 'completed'
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

      // MCP tool call
      // } else if (chunk.type === 'response.mcp_list_tools.in_progress') {
      //   console.log('MCP LIST TOOLS IN PROGRESS')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.mcp_list_tools.completed') {
      //   console.log('MCP LIST TOOLS COMPLETE')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.mcp_call.in_progress') {
      //   console.log('MCP CALL TOOLS IN PROGRESS')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.mcp_call.arguments.delta') {
      //   console.log('MCP CALL TOOLS ARGUMENTS DELTA')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.mcp_call.arguments.done') {
      //   console.log('MCP CALL TOOLS ARGUMENTS DONE')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.mcp_call.completed') {
      //   console.log('MCP CALL TOOLS COMPLETED')
      //   console.log(JSON.stringify(chunk, null, 2))
      //   // Reasoning
      // } else if (chunk.type === 'response.reasoning_summary_part.added') {
      //   console.log('REASONING SUMMARY PART ADDED')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.reasoning_summary_text.delta') {
      //   console.log('REASONING SUMMARY COMPLETED')
      //  // console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.reasoning_summary_text.done') {
      //   console.log('REASONING SUMMARY TEXT DONE')
      //   console.log(JSON.stringify(chunk, null, 2))
      // } else if (chunk.type === 'response.reasoning_summary_part.done') {
      //   console.log('REASONING SUMMARY PART DONE')
      //   console.log(JSON.stringify(chunk, null, 2))
      // }
    }

    event.node.res.end()
  })
})
