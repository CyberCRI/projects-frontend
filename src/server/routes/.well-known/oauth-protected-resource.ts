export default defineLazyEventHandler(() => {
  const { appMcpServerUrl } = useRuntimeConfig()
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public

  const MCP_URL = appMcpServerUrl.replace(/\?internal=true$/, '').replace(/\/mcp\/?$/, '') // this server's canonical URI
  const RESOURCE = `${MCP_URL}/mcp` // RFC 8707 resource indicator
  const ISSUER = `${appKeycloakUrl.replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`

  return defineEventHandler(async () => {
    return {
      resource: RESOURCE,
      authorization_servers: [ISSUER],
      jwks_uri: `${ISSUER}/protocol/openid-connect/certs`,
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:tools'],
      registration_endpoint: `${MCP_URL}/register`,
    }
  })
})
