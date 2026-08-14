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
    // traceMcp('/register parsedBody', JSON.stringify(parsedBody, null, 2))
  } catch {
    setResponseStatus(event, 400)
    return { error: 'invalid_client_metadata', error_description: 'Request body is not valid JSON' }
  }

  const redirectUris: string[] = parsedBody?.redirect_uris ?? []
  const allValid =
    redirectUris.length > 0 &&
    redirectUris.every((uri) => {
      try {
        return ALLOWED_REDIRECT_HOSTS.includes(new URL(uri).hostname)
      } catch {
        return false
      }
    })
  if (!allValid) {
    setResponseStatus(event, 400)
    return { error: 'invalid_redirect_uri' }
  }

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
      traceMcp('Client registered successfully', {
        client_id: data.client_id,
        client_name: data.client_name,
      })
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
