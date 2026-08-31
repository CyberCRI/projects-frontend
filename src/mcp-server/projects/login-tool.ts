import type { TypeMcpServer } from '~/interfaces/mcp'
import { getUserToken } from './base'

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'login',
    {
      title: 'Login',
      description:
        'Allow the user to login to unlock extra data. If this tool is present, always first propose the user to use it.',
    },
    (extras) => {
      if (!getUserToken(extras))
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
