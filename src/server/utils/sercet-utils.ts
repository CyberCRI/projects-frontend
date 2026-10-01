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
    const keys: Record<string, Buffer> = Object.fromEntries(
      Object.entries(JSON.parse(appAgentSecretKeys as string)).map(
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

export function encrypt(plaintext: string, aad: string) {
  const KEYS = getAgentSecretKeys()
  const CURRENT = getAgentSecretKeyCurrentVersion()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', KEYS[CURRENT], iv)
  cipher.setAAD(Buffer.from(aad))
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return { ciphertext: Buffer.concat([iv, tag, enc]), keyVersion: CURRENT }
}

export function decrypt(data: Buffer, keyVersion: number, aad: string) {
  const KEYS = getAgentSecretKeys()
  const key = KEYS[keyVersion]
  if (!key) throw new Error(`Unknown key version ${keyVersion}`)
  const iv = data.subarray(0, 12)
  const tag = data.subarray(12, 28)
  const enc = data.subarray(28)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAAD(Buffer.from(aad))
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

export function rotate(oldCyphertext, oldKeyVersion, aad) {
  const plain = decrypt(oldCyphertext, oldKeyVersion, aad)
  return encrypt(plain, aad)
}
