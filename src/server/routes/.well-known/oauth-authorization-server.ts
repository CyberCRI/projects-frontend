import { applyMcpCors } from '@/server/utils/mcp-cors'
export default defineLazyEventHandler(() => {
  const { appMcpServerUrl } = useRuntimeConfig()

  const MCP_URL = appMcpServerUrl.replace(/\?internal=true$/, '').replace(/\/mcp\/?$/, '') // this server's canonical URI
  // const RESOURCE = `${MCP_URL}/mcp` // RFC 8707 resource indicator
  // const ISSUER = `${appKeycloakUrl.replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`

  return defineEventHandler(async (event) => {
    if (applyMcpCors(event)) return
    return {
      issuer: MCP_URL,
      authorization_endpoint: `${MCP_URL}/authorize`,
      token_endpoint: `${MCP_URL}/token`,
      registration_endpoint: `${MCP_URL}/register`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none', 'client_secret_basic'],
      scopes_supported: ['openid', 'profile', 'email', 'offline_access', 'mcp:tools'],
    }
  })
})
