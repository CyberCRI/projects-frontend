// server/routes/token.post.ts
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'

export default defineEventHandler(async (event) => {
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public
  const ISSUER = `${appKeycloakUrl.replace(/\/$/, '')}/realms/${appKeycloakRealm}`

  const contentType = getHeader(event, 'content-type') || 'application/x-www-form-urlencoded'
  const rawBody = await readRawBody(event, 'utf-8')

  if (!rawBody) {
    traceMcp('Rejecting /token: empty body')
    setResponseStatus(event, 400)
    return { error: 'invalid_request', error_description: 'Request body is empty' }
  }

  traceMcp('Forwarding /token request')

  const forwardHeaders: Record<string, string> = { 'Content-Type': contentType }

  // Forward Authorization header for confidential clients using client_secret_basic —
  // public/PKCE clients won't send this, which is fine, it's simply omitted then.
  const authHeader = getHeader(event, 'authorization')
  if (authHeader) forwardHeaders['Authorization'] = authHeader

  try {
    const r = await fetch(`${ISSUER}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: forwardHeaders,
      body: rawBody,
    })

    const text = await r.text()
    let data: unknown
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: 'non_json_response', raw: text }
    }

    traceMcp('token response', r.status, r.statusText)
    setResponseStatus(event, r.status)
    setHeader(event, 'Content-Type', r.headers.get('content-type') || 'application/json')
    // RFC 6749 §5.1 requires these on token responses — tokens must never be cached.
    setHeader(event, 'Cache-Control', 'no-store')
    setHeader(event, 'Pragma', 'no-cache')
    return data
  } catch (e) {
    traceMcp('Error in /token', e)
    console.error('Error in /token', e)
    setResponseStatus(event, 502)
    return { error: 'token_proxy_error' }
  }
})
