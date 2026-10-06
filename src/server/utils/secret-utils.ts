import crypto from 'node:crypto'

export function getAgentSecretKeys() {
  if (import.meta.client) {
    throw new Error('Server-side-only code execution attempt in client')
  }
  const { appAgentSecretKeys } = useRuntimeConfig()
  if (!appAgentSecretKeys) {
    console.log('[AgentSecretKey]', 'No secret configured')
    return null
  }
  try {
    console.log('appAgentSecretKeys', appAgentSecretKeys)
    const keys: Record<string, Buffer> = Object.fromEntries(
      // Object.entries(JSON.parse(appAgentSecretKeys as string)).map(
      Object.entries(appAgentSecretKeys).map(
        ([v, k]) => [v, Buffer.from(k as string, 'base64')] // 32 bytes each
      )
    )
    return keys
  } catch (error) {
    console.error('[AgentSecretKey]', error)
  }
}

export function getAgentSecretKeyCurrentVersion() {
  if (import.meta.client) {
    throw new Error('Server-side-only code execution attempt in client')
  }
  const { appAgentSecretKeyCurrentVersion } = useRuntimeConfig()
  if (!appAgentSecretKeyCurrentVersion) {
    console.log('[AgentSecretKeyVersion]', 'No secret version configured')
    return null
  }
  try {
    return Number(appAgentSecretKeyCurrentVersion)
  } catch (error) {
    console.error('[AgentSecretKeyVersion]', error)
  }
}

export function encrypt(
  plaintext: string,
  aad: string
): { ciphertext: Uint8Array<ArrayBuffer>; keyVersion: number } {
  const KEYS = getAgentSecretKeys()
  const CURRENT = getAgentSecretKeyCurrentVersion()
  if (!KEYS || CURRENT == null) throw new Error('Agent secret keys not configured')
  const key = KEYS[CURRENT]
  if (!key) throw new Error(`Unknown key version ${CURRENT}`)

  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  cipher.setAAD(Buffer.from(aad))
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    ciphertext: Buffer.concat([iv, tag, enc]),
    keyVersion: CURRENT,
  }
}

export function decrypt(
  ciphertext: Uint8Array<ArrayBuffer>,
  keyVersion: number,
  aad: string
): string {
  const KEYS = getAgentSecretKeys()
  const key = KEYS?.[keyVersion]
  if (!key) throw new Error(`Unknown key version ${keyVersion}`)

  const iv = ciphertext.subarray(0, 12)
  const tag = ciphertext.subarray(12, 28)
  const enc = ciphertext.subarray(28)

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAAD(Buffer.from(aad))
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

export function rotate(oldCyphertext: Uint8Array<ArrayBuffer>, oldKeyVersion: number, aad: string) {
  const plain = decrypt(oldCyphertext, oldKeyVersion, aad)
  return encrypt(plain, aad)
}
