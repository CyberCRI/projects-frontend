// npm i @modelcontextprotocol/sdk
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'

function makeTransport(url, transport, headers) {
  const u = new URL(url)
  if (transport === 'sse') {
    return new SSEClientTransport(u, {
      requestInit: { headers }, // used for the POST messages
      // EventSource needs headers injected through a custom fetch
      eventSourceInit: {
        fetch: (input, init) =>
          fetch(input, { ...init, headers: { ...init?.headers, ...headers } }),
      },
    })
  }
  return new StreamableHTTPClientTransport(u, { requestInit: { headers } })
}

async function tryTransport(url, transport, headers, timeoutMs) {
  const client = new Client({ name: 'mcp-config-tester', version: '1.0.0' })
  const t = makeTransport(url, transport, headers)
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs)
  })

  try {
    const run = (async () => {
      await client.connect(t) // performs the initialize handshake
      const serverInfo = client.getServerVersion()
      const capabilities = client.getServerCapabilities() ?? {}
      let tools = []
      if (capabilities.tools) {
        tools = (await client.listTools()).tools.map((x) => x.name)
      }
      return { serverInfo, capabilities: Object.keys(capabilities), tools }
    })()
    return await Promise.race([run, timeout])
  } finally {
    clearTimeout(timer)
    await client.close().catch(() => {})
  }
}

/**
 * @param {object} cfg
 * @param {string} cfg.url
 * @param {"http"|"sse"} cfg.transport
 * @param {string} [cfg.apiKey]            sent as "Authorization: Bearer <key>"
 * @param {Record<string,string>} [cfg.headers]  extra/override headers (e.g. { "x-api-key": "..." })
 * @param {number} [cfg.timeoutMs=10000]
 */
export async function testMcpConfig({ url, transport, apiKey, headers = {}, timeoutMs = 10_000 }) {
  const allHeaders = { ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}), ...headers }
  const errors = []
  const start = Date.now()

  try {
    await tryTransport(url, transport, allHeaders, timeoutMs)
    return { ok: true, transport, latencyMs: Date.now() - start }
  } catch (err) {
    errors.push(`${transport}: ${err?.message ?? err}`)
  }
  return { ok: false, latencyMs: Date.now() - start, error: errors.join(' | ') }
}

// Example:
// console.log(await testMcpConfig({ url: "https://mcp.example.com/mcp", apiKey: process.env.MCP_KEY }));
//
//
export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const body = await readBody(event)
    if (body.id && body.apiKey === undefined) {
      const mcp = await getMcpById(appApiOrgCode, body.id, true)
      body.apiKey = mcp.apiKey
    }
    return await testMcpConfig({ url: body.url, transport: body.transport, apiKey: body.apiKey })
  })
})
