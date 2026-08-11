// tokenExchange.js
const TOKEN_ENDPOINT = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`
const CLIENT_ID = process.env.MCP_SERVER_CLIENT_ID // "mcp-server"
const CLIENT_SECRET = process.env.MCP_SERVER_CLIENT_SECRET

interface ExchangeTokenOptions {
  audience?: string
  scope?: string
}

interface CachedToken {
  accessToken: string
  expiresAt: number
}

interface TokenExchangeResponse {
  access_token: string
  expires_in: number
  token_type?: string
  scope?: string
  issued_token_type?: string
}

const cache = new Map<string, CachedToken>()

export async function exchangeToken(
  subjectToken: string,
  { audience, scope }: ExchangeTokenOptions = {}
): Promise<string> {
  const key = `${subjectToken}::${audience ?? ''}::${scope ?? ''}`
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now() + 5000) return cached.accessToken

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    subject_token: subjectToken,
    subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
  })
  if (audience) body.append('audience', audience)
  if (scope) body.append('scope', scope)

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body,
  })

  if (!res.ok) {
    throw new Error(`token-exchange failed (${res.status}): ${await res.text()}`)
  }

  const data: TokenExchangeResponse = await res.json()

  cache.set(key, {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  })

  return data.access_token
}
