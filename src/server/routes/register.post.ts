import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'

const ALLOWED_REDIRECT_HOSTS = ['claude.ai', 'claude.com', 'localhost', '127.0.0.1']

export default defineEventHandler(async (event) => {
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public
  const ISSUER = `${appKeycloakUrl.replace(/\/$/, '')}/realms/${appKeycloakRealm}`

  const rawBody = await readRawBody(event, 'utf-8')
  if (!rawBody) {
    traceMcp('Rejecting /register: empty body')
    setResponseStatus(event, 400)
    return { error: 'invalid_client_metadata', error_description: 'Request body is empty' }
  }

  let parsedBody: any
  try {
    parsedBody = JSON.parse(rawBody)
  } catch {
    traceMcp('Rejecting /register: body is not valid JSON', rawBody)
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
    traceMcp('Rejecting /register: invalid redirect_uris', redirectUris)
    setResponseStatus(event, 400)
    return {
      error: 'invalid_redirect_uri',
      error_description: 'redirect_uris must belong to an allowed host',
    }
  }

  // Don't forward client-requested scopes — mcp:tools is a realm Default scope and gets attached automatically.
  delete parsedBody.scope

  traceMcp('Registering client', {
    client_name: parsedBody?.client_name,
    redirect_uris: redirectUris,
  })

  try {
    const r = await fetch(`${ISSUER}/clients-registrations/openid-connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      // Log the created client_id — this is safe, it's not a secret.
      traceMcp('Client registered successfully', {
        client_id: data.client_id,
        client_name: data.client_name,
        client_id_issued_at: data.client_id_issued_at,
        redirect_uris: data.redirect_uris,
        token_endpoint_auth_method: data.token_endpoint_auth_method,
        // Deliberately NOT logging: client_secret, registration_access_token
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
