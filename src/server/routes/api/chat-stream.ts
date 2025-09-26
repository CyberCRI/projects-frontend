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

    const { messages } = await readBody<{ messages }>(event)

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

    const stream = await openai.responses.create({
      prompt,
      store: false, // do not store in OpenAI's servers, we do this on client side
      input: adaptedMessages, // [{ role: 'user', content: messages[0].content }]
      stream: true,
    })

    for await (const chunk of stream) {
      // TODO: handle other chunk types (like error)
      if (chunk.type === 'response.output_text.delta') {
        event.node.res.write(
          `data: ${JSON.stringify({ text: chunk.delta, role: 'assistant', is_done: false })}\n\n`
        )
      } else if (chunk.type === 'response.output_text.done') {
        event.node.res.write(
          // hackish: we send empty text so deepchat doesnt rerender it again
          // and done_text with complete response to add to conversation history
          `data: ${JSON.stringify({ text: '', done_text: chunk.text, role: 'assistant', is_done: true })}\n\n`
        )
      }
    }

    event.node.res.end()
  })
})
