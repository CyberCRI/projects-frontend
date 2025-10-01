import OpenAI from 'openai'

const { appOpenaiApiPromptId, appOpenaiApiPromptVersion, appOpenaiApiKey } = useRuntimeConfig()

export default defineLazyEventHandler(() => {
  // TODO respond with 404 if not configured
  if (!appOpenaiApiKey) {
    throw createError('Missing OpenAI API key')
  }
  const openai = new OpenAI({
    apiKey: appOpenaiApiKey,
  })

  return defineEventHandler(async (event) => {
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

    const requestOptions = {
      prompt,
      //store: false, // do not store in OpenAI's servers, we do this on client side
      store: true, // we want to store it to be able to use follow-up questions
      input: adaptedMessages, // [{ role: 'user', content: messages[0].content }]
      conversation: conversationId,
      reasoning: {},
      tools: [
        {
          type: 'file_search',
          vector_store_ids: ['vs_68da7bdcdba081918133c06e5984489b'],
        },
      ],
      stream: true,
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
