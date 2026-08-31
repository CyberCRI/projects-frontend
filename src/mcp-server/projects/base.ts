import type { ClientAPIOptions } from 'shared-projects-frontend/apis'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import type { InferSchema, ToolCallback } from '~/interfaces/mcp'

const runtimeConfig = useRuntimeConfig()
export const orgCode = runtimeConfig.public.appApiOrgCode

export function getUserToken(extras) {
  const token = (extras.requestInfo.headers['authorization'] || '').replace('Bearer ', '')
  if (token) {
    traceMcp('MCP tool user token has token ', token.substring(0, 6) + '...')
    return token
  }
  traceMcp('MCP tool user has no token')
  return null
}

export function mcpOptions(extras: any = {}): ClientAPIOptions {
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
    let output = null
    try {
      output = await callback(args, extra)
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
