import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { createMiddleware } from 'langchain'

export const safeStringify = (obj: unknown) => {
  const seen = new WeakSet()
  return JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    },
    2
  )
}

const loggingMiddleware = createMiddleware({
  name: 'LoggingMiddleware',
  beforeModel: (state) => {
    traceLangchain(`About to call model with ${state.messages.length} messages`)
    traceLangchain(safeStringify(state.messages)?.slice(0, 25) + '(...)')
    return
  },
  afterModel: (state) => {
    const lastMessage = state.messages[state.messages.length - 1]
    traceLangchain(`Model returned: ${lastMessage.content?.slice(0, 25)}` + '(...)')
    return
  },
  wrapToolCall: (request, handler) => {
    traceLangchain(`Tool called: ${request?.toolCall?.name}`)
    try {
      const result = handler(request)
      traceLangchain(`Tool completed successfully ${request?.toolCall?.name}`)
      return result
    } catch (e) {
      traceLangchain(`Tool ${request?.toolCall?.name} failed :`, e)
      throw e
    }
  },
})

export default loggingMiddleware
