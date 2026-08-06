import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import createMCPServer from '~/mcp-server'

import { AuthRequiredError } from '@/mcp-server/projects/login-tool'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node

  //   const eventStream = createEventStream(event)
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: false,
    allowedOrigins: ['*'],
  })
  traceMcp('New MCP connection established')

  // const body = await readBody(event)

  traceMcp('MCP connection request:')
  traceMcp(req.headers, req.method, req.url /*body*/)

  const mcpServer = createMCPServer()

  //   res.on('close', () => {
  //     transport.close()
  //   })
  // on h3 connection closed
  //   req.on('connect', () => {
  //     console.log('MCP connection opened')
  //   })
  res.on('close', () => {
    traceMcp('MCP connection closed, closing transport')
    transport.close()
    mcpServer.close()
  })

  //   eventStream.onClosed(() => {
  //     console.log('MCP connection closed, closing transport')
  //     //       transport.close()
  //   })

  try {
    await mcpServer.connect(transport)
    await transport.handleRequest(req, res)
  } catch (err) {
    if (err instanceof AuthRequiredError && !res.headersSent) {
      setResponseStatus(event, 401)
      setHeader(
        event,
        'WWW-Authenticate',
        `Bearer resource_metadata="${usePublicURL('/mcp/.well-known/oauth-protected-resource')}"`
      )

      return {
        statusCode: 401,
        message: 'Unauthorized',
      }
    }
    throw err
  }
  // return transport.handleRequest(req, res)
  // get res body
  //   return eventStream.send()
})
