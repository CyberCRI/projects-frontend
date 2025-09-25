//  yarn add langchain @langchain/core @langchain/openai @langchain/community
// import { LangChainStream, Message, StreamingTextResponse } from 'ai'
// import { ChatOpenAI } from '@langchain/openai'
// import { AIMessage, HumanMessage } from '@langchain/core/messages'

// export default defineLazyEventHandler(() => {
//   // fetch the OpenAI API key
//   const apiKey = useRuntimeConfig().appOpenaiApiKey
//   if (!apiKey) {
//     throw createError('Missing OpenAI API key')
//   }

//   // create a OpenAI LLM client
//   const llm = new ChatOpenAI({
//     apiKey: apiKey,
//     streaming: true,
//   })

//   return defineEventHandler(async (event) => {
//     const { messages } = await readBody<{ messages }>(event)

//     // const { stream, handlers } = LangChainStream()
//     // llm
//     //   .invoke(
//     //     (messages).map((message) =>
//     //       message.role === 'user'
//     //         ? new HumanMessage(message.content)
//     //         : new AIMessage(message.content)
//     //     ),
//     //     { callbacks: [handlers] }
//     //   )
//     //   .catch(console.error)
//     // return new StreamingTextResponse(stream)

//     console.log(messages)

//     // call the LLM and stream response back
//     const response = await llm.invoke(
//       messages.map((message) =>
//         message.role === 'user' ? new HumanMessage(message.text) : new AIMessage(message.text)
//       )
//     )
//     return { text: response.text }
//   })
// })

// yarn add ai @ai-sdk/openai @ai-sdk/vue zod
// import { streamText, UIMessage, convertToModelMessages } from 'ai';
// import { createOpenAI } from '@ai-sdk/openai';

// export default defineLazyEventHandler(async () => {
//   const apiKey = useRuntimeConfig().appOpenaiApiKey;
//   if (!apiKey) throw new Error('Missing OpenAI API key');
//   const openai = createOpenAI({
//     apiKey: apiKey,
//   });

//   return defineEventHandler(async (event: any) => {
//     const { messages }: { messages: UIMessage[] } = await readBody(event);

//     const result = streamText({
//       model: openai('gpt-4o'),
//       messages: convertToModelMessages(messages),
//     });

//     return result.toUIMessageStreamResponse();
//   });
// });

import { defineEventHandler, setResponseHeader, readBody } from 'h3'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// The endpoint expects a POST request with JSON body containing `threadId` and `assistantId`.
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const { threadId, assistantId } = await readBody(event)

  if (!threadId || !assistantId) {
    event.res.statusCode = 400
    event.res.end('Missing threadId or assistantId')
    return
  }

  try {
    const run = openai.beta.threads.runs.createAndStream(threadId, {
      assistant_id: assistantId,
      stream: true,
    })

    run.on('textDelta', (textDelta) => {
      // Stream each incremental text chunk as SSE "data"
      event.res.write(`data: ${textDelta.value.replace(/\n/g, '\\n')}\n\n`)
    })

    run.on('error', (err) => {
      event.res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`)
      event.res.end()
    })

    await run.finalRun()

    event.res.end()
  } catch (err: any) {
    event.res.statusCode = 500
    event.res.end(`Error: ${err.message || err}`)
  }
})
