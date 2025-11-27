import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import mcpServer from '@/mcp-server'
import { tokenMap, traceMcp } from '@/server/routes/api/chat-stream'
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

  const conversationId = getRequestHeader(event, 'Authorization') || ''
  if (conversationId) {
    traceMcp('MCP request with conversationId header')
    const tokenEntry = tokenMap.get(conversationId)
    if (tokenEntry) {
      traceMcp('MCP found token for conversationId', tokenEntry.token.substring(0, 6) + '...')
      // transport.setAuthorizationToken(tokenEntry.token)
    } else {
      traceMcp('MCP no token found for conversationId')
    }
  }

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
