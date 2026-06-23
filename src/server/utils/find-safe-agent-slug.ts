import type { PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client'

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export default async function findSafeAgentSlug(
  tx: PrismaClient | PrismaTx,
  agentId: number | null,
  slug: string,
  appApiOrgCode: string
): Promise<string> {
  async function isSlugUsed(testSlug: string): Promise<boolean> {
    const agentWhere: { slug: string; orgCode: string; id?: { not: number } } = {
      slug: testSlug,
      orgCode: appApiOrgCode,
    }
    if (agentId) {
      agentWhere.id = { not: agentId }
    }
    const [alias, agent] = await Promise.all([
      tx.agentSlugAlias.findFirst({
        where: { slug: testSlug, orgCode: appApiOrgCode },
      }),
      tx.agent.findFirst({
        where: agentWhere,
      }),
    ])

    // if new slug is an old alias, reuse it
    if (!agent && alias && alias.agentId == agentId) {
      // composite id not supported by deleet (need an id field) so use deleteMany heere
      await tx.agentSlugAlias.deleteMany({
        where: { slug: testSlug, orgCode: appApiOrgCode, agentId: agentId },
      })
      return false
    }
    return alias !== null || agent !== null
  }

  const baseSlug = slug
  let attempt = 0

  while (await isSlugUsed(attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`)) {
    ++attempt
  }

  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`
}
