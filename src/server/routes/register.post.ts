import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { applyMcpCors } from '@/server/utils/mcp-cors'

type RegistrationTokenParams = {
  clientId: string
  clientSecret: string
  issuer: string
}

async function getRegistrationToken({
  clientId,
  clientSecret,
  issuer,
}: RegistrationTokenParams): Promise<string> {
  const r = await fetch(`${issuer}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  })
  if (!r.ok) {
    const text = await r.text()
    throw new Error(`Failed to obtain registration token: ${r.status} ${text}`)
  }
  const data = await r.json()
  return data.access_token
}

// after your existing DCR POST succeeds and you have `data.client_id`:

async function tagClientAsManaged({
  keycloakUrl,
  realm,
  adminToken, // needs manage-clients (or FGAP grant) — see note below
  oauthClientId, // this is data.client_id from the DCR response
  attributes,
}: {
  keycloakUrl: string
  realm: string
  adminToken: string
  oauthClientId: string
  attributes: Record<string, string>
}) {
  // Admin REST API is keyed by the internal UUID, not the OAuth client_id string,
  // so look it up first.
  const lookupRes = await fetch(
    `${keycloakUrl}/admin/realms/${realm}/clients?clientId=${encodeURIComponent(oauthClientId)}`,
    { headers: { Authorization: `Bearer ${adminToken}` } }
  )
  const [client] = await lookupRes.json()
  if (!client) throw new Error(`Client ${oauthClientId} not found via admin API`)

  // Merge attributes into the existing representation rather than clobbering it.
  const updated = {
    ...client,
    attributes: { ...client.attributes, ...attributes },
  }

  const putRes = await fetch(`${keycloakUrl}/admin/realms/${realm}/clients/${client.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(updated),
  })
  if (!putRes.ok) {
    throw new Error(`Failed to tag client: ${putRes.status} ${await putRes.text()}`)
  }
}

export default defineEventHandler(async (event) => {
  if (applyMcpCors(event)) return
  const { appKeycloakUrl, appKeycloakRealm, appMcpAllowedHosts } = useRuntimeConfig().public
  const { appMcpKeycloakClientId, appMcpKeycloakClientSecret } = useRuntimeConfig()
  const ALLOWED_REDIRECT_HOSTS = ((appMcpAllowedHosts as string) || '').split('|')
  const ISSUER = `${appKeycloakUrl.replace(/\/$/, '')}/realms/${appKeycloakRealm}`

  const rawBody = await readRawBody(event, 'utf-8')
  if (!rawBody) {
    setResponseStatus(event, 400)
    return { error: 'invalid_client_metadata', error_description: 'Request body is empty' }
  }

  let parsedBody: any
  try {
    parsedBody = JSON.parse(rawBody)
    traceMcp('/register parsedBody', JSON.stringify(parsedBody, null, 2))
  } catch {
    setResponseStatus(event, 400)
    return { error: 'invalid_client_metadata', error_description: 'Request body is not valid JSON' }
  }

  const redirectUris: string[] = parsedBody?.redirect_uris ?? []

  const validateRedirectUris = (uri: string) => {
    try {
      return ALLOWED_REDIRECT_HOSTS.includes(new URL(uri).hostname)
    } catch {
      return false
    }
  }
  const validRedirectUris = redirectUris.filter(validateRedirectUris)
  const invalidRedirectUris = redirectUris.filter((uri) => !validateRedirectUris(uri))

  traceMcp('validRedirectUris', validRedirectUris.map((uri) => `"${uri}"`).join(' '))
  traceMcp('invalidRedirectUris', invalidRedirectUris.map((uri) => `"${uri}"`).join(' '))
  if (validRedirectUris.length === 0) {
    traceMcp('No redirect_uris matched an allowed host, respond with 400')
    setResponseStatus(event, 400)
    return {
      error: 'invalid_redirect_uri',
      error_description: 'No redirect_uris matched an allowed host',
    }
  }
  parsedBody.redirect_uris = validRedirectUris // only forward trusted setResponseStatus

  // Force public client + PKCE regardless of what the client specifies (or omits).
  // Per RFC 7591, omitting this field defaults to "client_secret_basic" (confidential),
  // which breaks PKCE-only clients like Perplexity that never send a secret back.
  // -> this is needed for perplexity host
  parsedBody.token_endpoint_auth_method = 'none'

  delete parsedBody.scope // mcp:tools is a realm Default scope — no need to trust client-supplied scope
  try {
    const registrationToken = await getRegistrationToken({
      clientId: appMcpKeycloakClientId as string,
      clientSecret: appMcpKeycloakClientSecret as string,
      issuer: ISSUER,
    })

    const r = await fetch(`${ISSUER}/clients-registrations/openid-connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${registrationToken}`,
      },
      body: JSON.stringify(parsedBody),
    })

    const text = await r.text()
    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: 'non_json_response', raw: text }
    }

    if (r.ok) {
      // Keycloak recomputes response_types/grant_types internally from client flags
      // rather than echoing the request, and can produce spurious extra entries
      // (e.g. "none" leaking into response_types). Since we know the correct values
      // for a public PKCE MCP client, assert them rather than trusting the derived output.
      data.response_types = ['code']
      data.grant_types = ['authorization_code', 'refresh_token']
      data.token_endpoint_auth_method = 'none'

      traceMcp(`Created client ${data.client_id}`)

      try {
        traceMcp(`Tagging client ${data.client_id} for inactivity workflow`)
        await tagClientAsManaged({
          keycloakUrl: appKeycloakUrl as string,
          realm: appKeycloakRealm as string,
          adminToken: registrationToken, // see permissions note below
          oauthClientId: data.client_id,
          attributes: { 'managed-by': 'mcp-registration-proxy' },
        })
        traceMcp(`Client ${data.client_id} registered successfully`, {
          client_id: data.client_id,
          client_name: data.client_name,
        })
      } catch (e) {
        traceMcp(`Failed to tag client ${data.client_id} for inactivity workflow`, e)
        throw e
      }
    } else {
      traceMcp('Client registration failed', { status: r.status, error: data })
    }

    setResponseStatus(event, r.status)
    return data
  } catch (e) {
    traceMcp('Error in /register', e)
    console.error('Error in /register', e)
    setResponseStatus(event, 502)
    return { error: 'registration_proxy_error' }
  }
})
