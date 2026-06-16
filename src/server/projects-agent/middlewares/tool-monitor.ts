import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { createMiddleware } from 'langchain'

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

export default toolMonitoringMiddleware
