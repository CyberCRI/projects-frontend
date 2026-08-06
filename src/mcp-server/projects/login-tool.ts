import type { TypeMcpServer } from '~/interfaces/mcp'
import { getUserToken } from './base'

export class AuthRequiredError extends Error {}

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'login',
    {
      title: 'Login',
      description:
        'Allow the user to login to unlock extra data. If this tool is present, always first propose the user to use it.',
    },
    (_, extras) => {
      if (!getUserToken(extras)) throw new AuthRequiredError()
      return {
        content: [
          { type: 'text', text: 'User is authenticated, do not use the login tool again.' },
        ],
      }
    }
  )
}
