import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkSuperAdminRights(event)
    const skill = await chatbotPrisma.skill.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: { skillContents: { include: { agents: true }, orderBy: { version: 'desc' } } },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return skill
  })
})
