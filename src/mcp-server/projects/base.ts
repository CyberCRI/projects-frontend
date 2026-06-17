import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { tokenMap } from '~/server/routes/api/chat-stream'
import type { TypeMcpServer } from '~/interfaces/mcp'

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

type RegisterToolType = Parameters<TypeMcpServer['registerTool']>
type RegisterToolCallback = RegisterToolType[2]
type OwnRegisterToolCallback = (...args: Parameters<RegisterToolCallback>) => Promise<any>

/**
 * auto contruct tool result from callback
 *
 * @async
 * @function
 * @name resultFromTool
 * @kind variable
 * @exports
 */
export const resultFromTool = (callback: OwnRegisterToolCallback) => {
  const callbackTool: RegisterToolCallback = async (args, extra) => {
    let output = null
    try {
      output = await callback(args, extra)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    } satisfies ReturnType<RegisterToolCallback>
  }

  return callbackTool
}
