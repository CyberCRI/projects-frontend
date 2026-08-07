import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import createMCPServer from '~/mcp-server'
export default defineEventHandler(async (event) => {
  const { appMcpServerUrl } = useRuntimeConfig()
  const { req, res } = event.node

  const { authed } = getQuery(event)
  const token = getRequestHeader(event, 'authorization') || ''

  if (authed && !token) {
    setResponseStatus(event, 401)
    setHeader(
      event,
      'WWW-Authenticate',
      `Bearer resource_metadata="${appMcpServerUrl}/mcp/.well-known/oauth-protected-resource'"`
    )

    return {
      statusCode: 401,
      message: 'Unauthorized',
    }
  }

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

  await mcpServer.connect(transport)
  await transport.handleRequest(req, res)

  // return transport.handleRequest(req, res)
  // get res body
  //   return eventStream.send()
})
