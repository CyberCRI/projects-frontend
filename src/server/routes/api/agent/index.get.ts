import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkSuperAdminRights(event)
    const agent = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: { include: { prompt: true } },
        skillContents: { include: { skillContent: { include: { skill: true } } } },
        documents: true,
        mcps: true,
      },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return agent
  })
})
