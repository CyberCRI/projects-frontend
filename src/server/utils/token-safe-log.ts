function decodeJwtPayload(token: string): object {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('malformed JWT')
  return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
}

const SAFE_CLAIMS = ['iss', 'aud', 'sub', 'exp', 'iat', 'nbf', 'jti', 'scope']

export default function jwtDebugInfo(token: string): object {
  try {
    const p = decodeJwtPayload(token)
    const out = Object.fromEntries(SAFE_CLAIMS.filter((k) => k in p).map((k) => [k, p[k]]))
    if (out.exp) out.expiresAt = new Date(out.exp * 1000).toISOString()
    return out
  } catch (err) {
    return {
      error_decoding_jwt: err,
    }
  }
}
