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

    const response = await openai.responses.create({
      prompt,
      store: false, // do not store in OpenAI's servers, we do this on client side
      input: adaptedMessages, // [{ role: 'user', content: messages[0].content }]
    })

    const adaptedResponse = {
      text: response.output_text,
    }

    return adaptedResponse
  })
})
