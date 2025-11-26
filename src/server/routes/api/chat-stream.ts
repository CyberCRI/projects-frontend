import OpenAI from 'openai'

const runtimeConfig = useRuntimeConfig()
const {
  appOpenaiApiPromptId,
  appOpenaiApiPromptVersion,
  appOpenaiApiKey,
  appOpenaiApiVectorStoreId,
  appMcpServerUrl,
} = runtimeConfig
const { appChatbotEnabled } = runtimeConfig.public

export const tokenMap = new Map<string, { date: Date; token: string }>()

export default defineLazyEventHandler(() => {
  const openai = appOpenaiApiKey
    ? new OpenAI({
        apiKey: appOpenaiApiKey,
      })
    : null

  console.log('appChatbotEnabled:', appChatbotEnabled)
  return defineEventHandler(async (event) => {
    // return 404 if not configured
    if (!openai || !appChatbotEnabled) {
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
      console.log('chat-stream: got Authorization header provided')
    } else {
      console.log('chat-stream: no Authorization header provided')
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
      const conversation = await openai.conversations.create()
      conversationId = conversation.id
    }

    console.log(
      `Starting chat stream for conversation ${conversationId} with ${messages.length} messages`
    )

    tokenMap.set(conversationId, {
      date: new Date(),
      token: ('' + tokenHeader).replace('Bearer ', ''),
    })

    const adaptedMessages = messages.map((message) => {
      return {
        role: message.role,
        content: message.text,
      }
    })

    const prompt = {
      id: appOpenaiApiPromptId,
    }
    if (appOpenaiApiPromptVersion) {
      prompt['version'] = String(appOpenaiApiPromptVersion)
    }

    const requestOptions: any = {
      prompt,
      //store: false, // do not store in OpenAI's servers, we do this on client side
      store: true, // we want to store it to be able to use follow-up questions
      input: adaptedMessages, // [{ role: 'user', content: messages[0].content }]
      conversation: conversationId,
      reasoning: {},
      tools: [],
      stream: true,
    }

    if (appMcpServerUrl) {
      console.log('Adding MCP tool with server URL:', appMcpServerUrl)
      requestOptions.tools.push({
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
      requestOptions.tools.push({
        type: 'file_search',
        vector_store_ids: [appOpenaiApiVectorStoreId],
      })
    }

    const stream: any = await openai.responses.create(requestOptions as any)

    for await (const chunk of stream) {
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
      }
    }

    event.node.res.end()
  })
})
