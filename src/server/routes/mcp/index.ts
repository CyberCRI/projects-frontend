import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import mcpServer from '@/mcp-server'
export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  //   const eventStream = createEventStream(event)
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: false,
    allowedOrigins: ['*'],
  })
  console.log('New MCP connection established')
  //   res.on('close', () => {
  //     transport.close()
  //   })
  // on h3 connection closed
  //   req.on('connect', () => {
  //     console.log('MCP connection opened')
  //   })
  res.on('close', () => {
    console.log('MCP connection closed, closing transport')
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
