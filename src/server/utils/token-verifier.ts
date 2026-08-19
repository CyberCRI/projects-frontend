import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export const verifierFactory = (
  JWKS_URI: string,
  KEYCLOAK_ISSUER: string,
  MCP_RESOURCE: string
) => {
  traceMcp('verifier factory called...')
  const remoteJwks = createRemoteJWKSet(new URL(JWKS_URI)) // fetched once, cached/rotated automatically
  traceMcp('...remote JWKSet created')
  return {
    async verifyAccessToken(token: string) {
      try {
        traceMcp('Verifying token...')
        const { payload } = await jwtVerify(token, remoteJwks, {
          issuer: KEYCLOAK_ISSUER,
          audience: MCP_RESOURCE, // hard reject if this token wasn't minted for THIS server
        })
        const tokenData = {
          clientId: (payload.azp as string) ?? (payload.client_id as string),
          scopes: typeof payload.scope === 'string' ? payload.scope.split(' ') : [],
          expiresAt: payload.exp as number,
        }
        traceMcp('...token verified', JSON.stringify(tokenData, null, 2))
        return {
          token,
          ...tokenData,
        }
      } catch (err) {
        traceMcp('Verifier error', err)
        throw err
      }
    },
  }
}
