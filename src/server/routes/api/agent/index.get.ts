import formatAgentWithTranslation from '@/server/utils/format-agent-with-translation'
import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const agents = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: { include: { prompt: true } },
        skillContents: { include: { skillContent: { include: { skill: true } } } },
        sideAssistants: true,
        documents: true,
        mcps: true,
        agentTranslations: true,
      },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return agents.map((agent) => ({
      ...agent,
      ...formatAgentWithTranslation(agent, agent.agentTranslations),
    }))
  })
})
