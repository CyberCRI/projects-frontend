import type { Prisma, PrismaClient } from '~~/prisma-chatbot-db/generated/prisma/client.ts'

type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

type AgentFields = Prisma.AgentSelect

export default async function agentFindBySlug(
  tx: PrismaClient | PrismaTx,
  slug: string,
  appApiOrgCode: string,
  agentFields?: AgentFields
) {
  const agentQuery = {
    slug,
    orgCode: appApiOrgCode,
  }

  const alias = await tx.agentSlugAlias.findFirst({
    where: agentQuery,
    include: {
      agent: { select: agentFields },
    },
  })

  if (alias) {
    await tx.agentSlugAlias.updateMany({
      where: agentQuery,
      data: {
        lastAccess: new Date(),
      },
    })
    return alias.agent
  }

  // findUnique doesn't work because slug is not globally unique
  return tx.agent.findFirst({
    where: agentQuery,
    select: agentFields,
  })
}
