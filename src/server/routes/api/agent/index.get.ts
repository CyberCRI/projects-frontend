import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const agent = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: { include: { prompt: true } },
        skillContents: { include: { skillContent: { include: { skill: true } } } },
        sideAssistants: true,
        documents: true,
        mcps: true,
      },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return agent
  })
})
