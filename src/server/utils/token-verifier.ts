import { createRemoteJWKSet, jwtVerify } from 'jose'

export const verifierFactory = (
  JWKS_URI: string,
  KEYCLOAK_ISSUER: string,
  MCP_RESOURCE: string
) => {
  const remoteJwks = createRemoteJWKSet(new URL(JWKS_URI)) // fetched once, cached/rotated automatically
  return {
    async verifyAccessToken(token: string) {
      const { payload } = await jwtVerify(token, remoteJwks, {
        issuer: KEYCLOAK_ISSUER,
        audience: MCP_RESOURCE, // hard reject if this token wasn't minted for THIS server
      })
      return {
        token,
        clientId: (payload.azp as string) ?? (payload.client_id as string),
        scopes: typeof payload.scope === 'string' ? payload.scope.split(' ') : [],
        expiresAt: payload.exp as number,
      }
    },
  }
}
