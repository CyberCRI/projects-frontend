export default async function agentFindbySlug(tx, slug, appApiOrgCode, agentFields) {
  const agentQuery = {
    slug: slug,
    orgCode: appApiOrgCode,
  }

  const alias = await tx.agentSlugAlias.findFirst({
    where: agentQuery,
    include: {
      agent: { select: agentFields },
    },
  })

  let agent = null

  if (alias) {
    // update last access
    await tx.agentSlugAlias.updateMany({
      where: agentQuery,
      data: {
        lastAccess: new Date(),
      },
    })
    agent = alias.agent
  } else {
    // findUnique dont work because slug is not globally unique
    agent = await chatbotPrisma.agent.findFirst({
      where: agentQuery,
      select: agentFields,
    })
  }

  return agent
}
