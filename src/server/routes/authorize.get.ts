// server/routes/authorize.get.ts
import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { applyMcpCors } from '@/server/utils/mcp-cors'

export default defineEventHandler(async (event) => {
  if (applyMcpCors(event)) return
  const { appKeycloakUrl, appKeycloakRealm, appMcpAllowedHosts } = useRuntimeConfig().public
  const query = getQuery(event)
  const ALLOWED_REDIRECT_HOSTS = ((appMcpAllowedHosts as string) || '').split('|')
  traceMcp('/authorize hit with with query:\n', JSON.stringify(query, null, 2))

  // Defensive: refuse to forward to Keycloak if redirect_uri isn't one we trust.
  // This is an open-redirect guard — without it, this route would let anyone
  // construct a Keycloak login flow that redirects the resulting code anywhere.
  const redirectUri = query.redirect_uri as string | undefined
  if (redirectUri) {
    try {
      const host = new URL(redirectUri).hostname
      if (!ALLOWED_REDIRECT_HOSTS.includes(host)) {
        traceMcp(
          `Rejecting /authorize: disallowed redirect_uri host ${host} (allowed: ${ALLOWED_REDIRECT_HOSTS.map((host) => `"${host}"`).join(', ')}) `
        )
        throw createError({ statusCode: 400, statusMessage: 'invalid_redirect_uri' })
      }
    } catch (err) {
      traceMcp('Error in /authorize', err)
      throw createError({ statusCode: 400, statusMessage: 'invalid_redirect_uri' })
    }
  }

  const ISSUER = `${appKeycloakUrl.replace(/\/$/, '')}/realms/${appKeycloakRealm}`
  const qs = new URLSearchParams(query as Record<string, string>).toString()
  const target = `${ISSUER}/protocol/openid-connect/auth?${qs}`

  traceMcp('Redirecting /authorize to Keycloak', target)
  return sendRedirect(event, target, 302)
})
