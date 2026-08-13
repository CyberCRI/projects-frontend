// import { getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { exchangeToken } from '@/server/utils/token-exchange'
import { applyMcpCors } from '@/server/utils/mcp-cors'
// import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
// import { requireBearerAuth } from '@modelcontextprotocol/server'
import createMCPServer from '~/mcp-server'
export default defineEventHandler(async (event) => {
  if (applyMcpCors(event)) return
  const runtimeConfig = useRuntimeConfig()
  const { appMcpServerUrl } = runtimeConfig

  const { appKeycloakClientId, appKeycloakClientSecret } = runtimeConfig.public
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public

  const keycloakClientConf = {
    TOKEN_ENDPOINT: `${appKeycloakUrl}/realms/${appKeycloakRealm}/protocol/openid-connect/token`,
    CLIENT_ID: appKeycloakClientId as string,
    CLIENT_SECRET: appKeycloakClientSecret as string,
  }

  const { req, res } = event.node

  const MCP_URL = appMcpServerUrl.replace(/\?internal=true$/, '').replace(/\/mcp\/?$/, '') // this server's canonical URI
  // const RESOURCE = `${MCP_URL}/mcp` // RFC 8707 resource indicator
  // const ISSUER = `${appKeycloakUrl.replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`

  const { authed, internal } = getQuery(event)
  const token = getRequestHeader(event, 'authorization') || ''
  let downstreamAccessToken = null

  if (internal) {
    traceMcp('Internal access...')
    if (token) {
      traceMcp('...With auth token')
    } else {
      traceMcp('...Anonymous')
    }
  } else {
    traceMcp('External access')
    if (authed) {
      traceMcp('Authenticated acces...')
      if (!token) {
        traceMcp('...No token')
        setResponseStatus(event, 401)
        setHeader(
          event,
          'WWW-Authenticate',
          `Bearer resource_metadata="${MCP_URL}/.well-known/oauth-protected-resource'"`
        )

        return {
          statusCode: 401,
          message: 'Unauthorized',
        }
      } else {
        traceMcp('...With pkce token...')

        const auth = getRequestHeader(event, 'authorization') || ''
        if (!auth?.startsWith('Bearer ')) {
          return {
            statusCode: 401,
            message: 'missing_bearer_token',
          }
        }
        const subjectToken = auth.slice('Bearer '.length)

        try {
          downstreamAccessToken = await exchangeToken(keycloakClientConf, subjectToken) // {audience, scope} ?
          traceMcp('...token exchaged')
        } catch (err) {
          traceMcp('...token exchage failed')
          console.error('token exchange error:', err.message)
          return { status: 502, message: 'token_exchange_failed' }
        }
      }
    } else {
      traceMcp('...Anonymous access')
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

  if (downstreamAccessToken) {
    req.headers['authorization'] = `Bearer ${downstreamAccessToken}`
  }

  await mcpServer.connect(transport)
  await transport.handleRequest(req, res)

  // return transport.handleRequest(req, res)
  // get res body
  //   return eventStream.send()
})
