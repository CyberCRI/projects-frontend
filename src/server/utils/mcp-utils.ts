import type { Mcp } from '~~/prisma-chatbot-db/generated/prisma/client'
import * as secretUtils from '~/server/utils/secret-utils'
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
    mcp.apiKeyLast4 = mcp.apiKey.slice(-4)
    const { keyVersion, ciphertext } = secretUtils.encrypt(mcp.apiKey, mcp.id)
    mcp.apiKeyVersion = keyVersion
    mcp.apiKeyCiphertext = ciphertext
  } else {
    // safeguard against incoherent payloads
    mcp.apiKeyLast4 = undefined
    mcp.apiKeyVersion = undefined
    mcp.apiKeyCiphertext = undefined
  }
  mcp.apiKey = undefined
  return mcp
}

export function dangerouslyDecryptApiKey(mcp): Mcp & { apiKey: string } {
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

export async function getMcpById(
  appApiOrgCode: string,
  id: string,
  dontRedact = false
): Promise<Mcp & { apiKey?: string }> {
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

export async function getAllMcp(appApiOrgCode: string) {
  const mcp = await chatbotPrisma.mcp.findMany({
    where: {
      orgCode: appApiOrgCode,
    },
    orderBy: { title: 'asc' },
  })
  mcp.map(redactApiKey)
  return mcp
}

export async function getPendingRotationCount(appApiOrgCode: string) {
  const CURRENT = getAgentSecretKeyCurrentVersion()
  const staleCount = await chatbotPrisma.mcp.count({
    where: { orgCode: appApiOrgCode, keyVersion: { not: CURRENT } },
  })
  return staleCount
}

export async function rotateAll(appApiOrgCode: string) {
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
    const { ciphertext, keyVersion } = secretUtils.rotate(
      Buffer.from(plain, 'base64'),
      oldKeyVersion,
      aad
    )
    await chatbotPrisma.mcp.update({
      where: { id: mcp.id },
      data: { apiKeyCiphertext: ciphertext, apiKeyVersion: keyVersion },
    })
  }
}
