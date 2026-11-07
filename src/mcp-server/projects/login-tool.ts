import type { McpServer, ServerContext } from '@modelcontextprotocol/server'
import { getUserToken } from './base'

export default (server: McpServer) => {
  // Add an search tool
  server.registerTool(
    'login',
    {
      title: 'Login',
      description:
        'Allow the user to login to unlock extra data. If this tool is present, always first propose the user to use it.',
    },
    (ctx: ServerContext) => {
      if (!getUserToken(ctx))
        return {
          content: [
            {
              type: 'text',
              text: 'Use the PRM document (/.well-known/oauth-protected-resource) to authenticate the user.',
            },
          ],
        }
      return {
        content: [
          { type: 'text', text: 'User is authenticated, do not use the login tool again.' },
        ],
      }
    }
  )
}
