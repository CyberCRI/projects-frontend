import { applyMcpCors } from '@/server/utils/mcp-cors'
export default defineLazyEventHandler(() => {
  const { appMcpServerUrl, appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig()
  const KEYCLOAK_ISSUER = `${(appKeycloakUrl as string).replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`
  const MCP_SERVER_URL = (appMcpServerUrl as string)
    .replace(/\?internal=true$/, '')
    .replace(/\/mcp\/?$/, '') // this server's canonical URI
  const MCP_RESOURCE = `${MCP_SERVER_URL}/mcp` // RFC 8707 resource indicator
  const JWKS_URI = `${KEYCLOAK_ISSUER}/protocol/openid-connect/certs`

  return defineEventHandler(async (event) => {
    if (applyMcpCors(event)) return
    return {
      resource: MCP_RESOURCE,
      authorization_servers: [KEYCLOAK_ISSUER],
      jwks_uri: JWKS_URI,
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:tools'],
    }
  })
})
