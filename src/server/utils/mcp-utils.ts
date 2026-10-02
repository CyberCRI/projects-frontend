import * as secretUtils from '~/server/utils/sercet-utils'
import crypto from 'node:crypto'

export function redactApiKey(mcp) {
  mcp.apiKeyCiphertext = undefined
  mcp.apiKeyVersion = undefined
  return mcp
}

export function updateApikey(mcp) {
  if (mcp.apiKey) {
    if (!mcp.id) {
      throw Error('MCP id is required')
    }
    mcp.apiKeyLast4 = mcp.apiKey.mcp.apiKey.slice(-4)
    mcp.apiKeyVersion = secretUtils.getAgentSecretKeyCurrentVersion()
    mcp.apiKeyCiphertext = secretUtils.encrypt(mcp.apiKey, mcp.id)
  } else {
    // safeguard against incoherent payloads
    mcp.apiKeyLast4 = undefined
    mcp.apiKeyVersion = undefined
    mcp.apiKeyCiphertext = undefined
  }
  mcp.apiKey = undefined
  return mcp
}

export function dangerouslyDecryptApiKey(mcp) {
  let apiKey = ''
  if (mcp.apiKeyCiphertext?.length) {
    apiKey = decrypt(mcp.apiKeyCiphertext, mcp.apiKeyVersion, mcp.id)
  }
  mcp.apiKey = apiKey
  return mcp
}

export function createId() {
  return crypto.randomUUID()
}

export async function getMcpById(appApiOrgCode, id, dontRedact = false) {
  const mcp = await chatbotPrisma.mcp.findUnique({
    where: {
      id: id,
      orgCode: appApiOrgCode,
    },
  })
  if (!dontRedact) redactApiKey(mcp)
  else dangerouslyDecryptApiKey(mcp)
  return mcp
}

export async function getAllMcp(appApiOrgCode) {
  const mcp = await chatbotPrisma.mcp.findMany({
    where: {
      orgCode: appApiOrgCode,
    },
    orderBy: { title: 'asc' },
  })
  return mcp
}

export async function rotateAll(appApiOrgCode) {
  const CURRENT = getAgentSecretKeyCurrentVersion()
  // TODO: filter those without pai key
  const stale = await chatbotPrisma.mcp.findMany({
    where: { orgCode: appApiOrgCode, keyVersion: { not: CURRENT } },
    take: 500,
  })
  for (const mcp of stale) {
    const aad = mcp.id
    const oldKeyVersion = mcp.apiKeyVersion
    const plain = secretUtils.decrypt(mcp.apiKeyCiphertext, oldKeyVersion, aad)
    const { ciphertext, keyVersion } = secretUtils.rotate(plain, oldKeyVersion, aad)
    await chatbotPrisma.mcp.update({
      where: { id: mcp.id },
      data: { apiKeyCiphertext: ciphertext, apiKeyVersion: keyVersion },
    })
  }
}
