import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import type { InferSchema, ToolCallback } from '~/interfaces/mcp'
import { tokenMap } from '~/server/routes/api/chat-stream'

const runtimeConfig = useRuntimeConfig()
export const orgCode = runtimeConfig.public.appApiOrgCode

export function getUserToken(extras) {
  const convesrationId = (extras.requestInfo.headers['authorization'] || '').replace('Bearer ', '')
  traceMcp('Tool Getting user token for conversationId', convesrationId)
  const tokenEntry = tokenMap.get(convesrationId)
  if (tokenEntry) {
    traceMcp('MCP tool found token for conversationId', tokenEntry.token.substring(0, 6) + '...')
    return tokenEntry.token
  } else {
    traceMcp('MCP tool no token found for conversationId', convesrationId)
  }
  return null
}

export function mcpOptions(extras: any = {}): UseApiOptions {
  const accessToken = getUserToken(extras)
  if (!accessToken) {
    return {}
  }
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
}

/**
 * auto contruct tool result from callback
 *
 * @async
 * @function
 * @name resultFromTool
 * @kind variable
 * @exports
 */
export const resultFromTool = <InputSchema, OutputSchema>(
  callback: (
    ...args: Parameters<ToolCallback<InputSchema, OutputSchema>>
  ) => InferSchema<OutputSchema> | Promise<InferSchema<OutputSchema>>
): ToolCallback<InputSchema, OutputSchema> => {
  return async (args, extra) => {
    const output = await callback(args, extra)

    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
}
