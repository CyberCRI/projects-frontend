// import { getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js'
import {
  requireBearerAuth,
  getOAuthProtectedResourceMetadataUrl,
} from '@modelcontextprotocol/server'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { verifierFactory } from '@/server/utils/token-verifier'
import { exchangeToken } from '@/server/utils/token-exchange'
import { applyMcpCors } from '@/server/utils/mcp-cors'
import createMCPServer from '~/mcp-server'

export default defineEventHandler(async (event) => {
  const cors = applyMcpCors(event)
  if (cors) return cors
  const runtimeConfig = useRuntimeConfig()
  const { appMcpServerUrl } = runtimeConfig

  // const { appKeycloakClientId, appKeycloakClientSecret } = runtimeConfig.public
  const { appKeycloakUrl, appKeycloakRealm, appKeycloakClientId, appKeycloakClientSecret } =
    useRuntimeConfig().public
  const KEYCLOAK_ISSUER = `${(appKeycloakUrl as string).replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`
  const MCP_SERVER_URL = (appMcpServerUrl as string)
    .replace(/\?internal=true$/, '') // present for "normal" projects mcp
    .replace(/\/mcp\/?$/, '') // this server's canonical URI
  const MCP_RESOURCE = `${MCP_SERVER_URL}/mcp` // RFC 8707 resource indicator
  const JWKS_URI = `${KEYCLOAK_ISSUER}protocol/openid-connect/certs`

  traceMcp('/mcp', JSON.stringify(getQuery(event), null, 2))

  const keycloakClientConf = {
    TOKEN_ENDPOINT: `${appKeycloakUrl}/realms/${appKeycloakRealm}/protocol/openid-connect/token`,
    CLIENT_ID: appKeycloakClientId as string,
    CLIENT_SECRET: appKeycloakClientSecret as string,
  }

  const { req, res } = event.node

  const { authed, internal } = getQuery(event)
  const token = getRequestHeader(event, 'authorization') || ''
  let exchangedToken = null
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

      const gate = requireBearerAuth({
        verifier: verifierFactory(JWKS_URI, KEYCLOAK_ISSUER, MCP_RESOURCE),
        //requiredScopes: ['mcp:tools'],
        resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(new URL(MCP_SERVER_URL)),
      })

      const request = toWebRequest(event) // Nitro → standard Fetch Request, no Express shim
      const auth = await gate(request) // AuthInfo on success, ready-made 401/403 Response on failure
      if (auth instanceof Response) {
        traceMcp('auth is Response', auth)
        return auth // h3 forwards Fetch Response objects as-is
      } else {
        traceMcp('auth is AuthInfo')
        traceMcp('proceed to token exchange')
        exchangedToken = await exchangeToken(keycloakClientConf, token.slice('Bearer '.length))
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

  if (exchangedToken) {
    req.headers['authorization'] = `Bearer ${exchangedToken}`
  }

  await mcpServer.connect(transport)
  await transport.handleRequest(req, res)

  // return transport.handleRequest(req, res)
  // get res body
  //   return eventStream.send()
})
