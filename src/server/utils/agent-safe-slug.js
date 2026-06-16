export default async function findSafeAgentSlug(tx, agentId, slug, appApiOrgCode) {
  async function usedSlug(testSlug) {
    const alias = await tx.agentSlugAlias.findFirst({
      where: { slug: testSlug, orgCode: appApiOrgCode },
    })
    const agent = await tx.agent.findFirst({
      where: { slug: testSlug, orgCode: appApiOrgCode, id: { not: agentId } },
    })
    return !!alias || !!agent
  }

  const baseSlug = slug
  let slugIsUsed = await usedSlug(slug)
  let attempt = 0
  while (slugIsUsed) {
    ++attempt
    slug = baseSlug + `-${attempt}`
    slugIsUsed = await usedSlug(slug)
  }
  return slug
}
