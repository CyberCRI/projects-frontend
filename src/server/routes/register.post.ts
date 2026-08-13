import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
export default defineEventHandler(async (event) => {
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public
  // const { req, res } = event.node
  const body = await readBody(event)
  // const MCP_URL = appMcpServerUrl.replace(/\?internal=true$/, '').replace(/\/mcp\/?$/, '') // this server's canonical URI
  // const RESOURCE = `${MCP_URL}/mcp` // RFC 8707 resource indicator
  const ISSUER = `${appKeycloakUrl.replace(/\/?$/, '')}/realms/${appKeycloakRealm}/`

  traceMcp('Registering client', body)
  try {
    const r = await fetch(`${ISSUER}/clients-registrations/openid-connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${process.env.KC_INITIAL_ACCESS_TOKEN}`, // your server's secret, not the user's
      },
      body: body,
    })
    traceMcp('register response status', r.status, r.statusText)
    const data = await r.json()
    return data
  } catch (e) {
    traceMcp('Error in /register', e)
    console.error('Error in /register', e)
  }
})
