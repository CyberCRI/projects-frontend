import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { handleCors, type H3Event } from 'h3'

// this aim to fix an issue with perplixity and mcp client registration
export function applyMcpCors(event: H3Event) {
  const { appMcpAllowedHosts } = useRuntimeConfig().public
  const ALLOWED_ORIGINS = ((appMcpAllowedHosts as string) || '')
    .split('|')
    .filter((origin) => origin != 'localhost' && origin != '127.0.0.1')

  const path = getRequestURL(event).pathname
  traceMcp(
    `CORS middleware triggered on path ${path} with allowed origins:`,
    ALLOWED_ORIGINS.map((origin) => `"${origin}"`).join(', ')
  )
  return handleCors(event, {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'Mcp-Session-Id', 'MCP-Protocol-Version'],
    exposeHeaders: ['Mcp-Session-Id', 'WWW-Authenticate'], // the critical one for this bug
    credentials: false,
  })
}
