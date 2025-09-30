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

    // console.log('\x1b[36m%s\x1b[0m', 'MESSAGES FROM FRONTEND')
    // messages.forEach((message) => {
    //   console.log('\x1b[36m%s\x1b[0m', JSON.stringify(message, null, 2))
    // })

    // console.log('\x1b[36m%s\x1b[0m', 'PREVIOUS MESSAGE ID')
    // console.log('\x1b[36m%s\x1b[0m', previousResponseId)

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
    }

    // console.log('\x1b[36m%s\x1b[0m', 'OPENAI REQUEST')
    // console.log(JSON.stringify(requestOptions, null, 2), 'color:#0ff;')

    const response = await openai.responses.create(requestOptions as any)

    // console.log('\x1b[36m%s\x1b[0m', 'OPENAI RESPONSE')
    // console.log('OpenAI response:\n%c' + JSON.stringify(response, null, 2), 'color:#ff0;')

    const adaptedResponse = {
      id: response.id,
      text: response.output_text,
      conversationId: conversationId,
    }

    return adaptedResponse
  })
})
