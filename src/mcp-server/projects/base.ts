import type { CallToolResult, ServerContext } from '@modelcontextprotocol/server'
import type { ClientAPIOptions } from 'shared-projects-frontend/apis'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'

const runtimeConfig = useRuntimeConfig()
export const orgCode = runtimeConfig.public.appApiOrgCode

export function getUserToken(ctx: ServerContext) {
  const token = (ctx.http?.req?.headers.get('authorization') || '').replace('Bearer ', '')
  if (token) {
    traceMcp('MCP tool user token has token ', token.substring(0, 6) + '...')
    return token
  }
  traceMcp('MCP tool user has no token')
  return null
}

export function mcpOptions(ctx: ServerContext): ClientAPIOptions {
  const accessToken = getUserToken(ctx)
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
export const resultFromTool = <Args, Output>(
  callback: (args: Args, ctx: ServerContext) => Output | Promise<Output>
) => {
  return async (args: Args, ctx: ServerContext): Promise<CallToolResult> => {
    let output: Output | null = null
    try {
      output = await callback(args, ctx)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      // TODO: reconsider this 'structuredContent' option
      // format issue - too long to fix for now, so just removed it
      // (some need {results: ...}) some dont)
      // anyway it desnt sem reallu useful for us and consume more token
      // structuredContent: output,
    }
  }
}
