import type { PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client.ts'

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export default async function findSafeAgentSlug(
  tx: PrismaClient | PrismaTx,
  agentId: number,
  slug: string,
  appApiOrgCode: string
): Promise<string> {
  async function isSlugUsed(testSlug: string): Promise<boolean> {
    const [alias, agent] = await Promise.all([
      tx.agentSlugAlias.findFirst({
        where: { slug: testSlug, orgCode: appApiOrgCode },
      }),
      tx.agent.findFirst({
        where: { slug: testSlug, orgCode: appApiOrgCode, id: { not: agentId } },
      }),
    ])
    return alias !== null || agent !== null
  }

  const baseSlug = slug
  let attempt = 0

  while (await isSlugUsed(attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`)) {
    ++attempt
  }

  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`
}
