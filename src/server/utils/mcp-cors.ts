import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { handleCors, type H3Event } from 'h3'

// only needed if a browser-based client (e.g. MCP Inspector) calls /mcp directly
export function applyMcpCors(event: H3Event) {
  const origin = getRequestHeader(event, 'origin')
  if (!origin) return
  const path = getRequestURL(event).pathname
  traceMcp(`CORS middleware triggered on path ${path} with origins: ${origin}`)
  return handleCors(event, {
    origin: [origin], // reflect the exact caller back; MCP clients call from many origins, so a fixed allowlist or '*' breaks legitimate ones
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Mcp-Session-Id', 'Mcp-Protocol-Version'],
    exposeHeaders: [
      'WWW-Authenticate', // so a browser-side client can read the 401 challenge + resource_metadata pointer
      'Mcp-Session-Id',
      'Mcp-Protocol-Version',
    ],
    credentials: false, // MCP auth here is Bearer-token based, not cookie-based, so no credentialed CORS is needed
    maxAge: '86400',
    preflight: {
      statusCode: 204,
    },
  })
}
