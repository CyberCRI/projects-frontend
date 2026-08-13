import { applyMcpCors } from '@/server/utils/mcp-cors'
export default defineLazyEventHandler(() => {
  const { appMcpServerUrl } = useRuntimeConfig()
  const MCP_URL = appMcpServerUrl.replace(/\?internal=true$/, '').replace(/\/mcp\/?$/, '') // this server's canonical URI
  const RESOURCE = `${MCP_URL}/mcp` // RFC 8707 resource indicator
  // const ISSUER = `${appKeycloakUrl.replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`

  return defineEventHandler(async (event) => {
    if (applyMcpCors(event)) return
    return {
      resource: RESOURCE,
      authorization_servers: [MCP_URL],
      bearer_methods_supported: ['header'],
      scopes_supported: ['mcp:tools'],
    }
  })
})
