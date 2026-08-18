import { applyMcpCors } from '@/server/utils/mcp-cors'
export default defineLazyEventHandler(() => {
  const { appMcpServerUrl } = useRuntimeConfig()
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public
  const KEYCLOAK_ISSUER = `${(appKeycloakUrl as string).replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`
  const MCP_SERVER_URL = (appMcpServerUrl as string)
    .replace(/\?internal=true$/, '') // present for "normal" projects mcp
    .replace(/\/mcp\/?$/, '') // this server's canonical URI
  const MCP_RESOURCE = `${MCP_SERVER_URL}/mcp` // RFC 8707 resource indicator

  return defineEventHandler(async (event) => {
    const cors = applyMcpCors(event)
    if (cors) return cors
    return {
      resource: MCP_RESOURCE,
      authorization_servers: [KEYCLOAK_ISSUER],
    }
  })
})
