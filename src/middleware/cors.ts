import { handleCors } from 'h3'

// this aim to fix an issue with perplixity and mcp client registration
export default defineEventHandler((event) => {
  const { appMcpAllowedHosts } = useRuntimeConfig().public
  const ALLOWED_ORIGINS = ((appMcpAllowedHosts as string) || '')
    .split('|')
    .filter((origin) => origin != 'localhost' && origin != '127.0.0.1')

  const path = getRequestURL(event).pathname
  if (!path.startsWith('/mcp')) return

  handleCors(event, {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'Mcp-Session-Id', 'MCP-Protocol-Version'],
    exposeHeaders: ['Mcp-Session-Id', 'WWW-Authenticate'], // the critical one for this bug
    credentials: false,
  })
})
