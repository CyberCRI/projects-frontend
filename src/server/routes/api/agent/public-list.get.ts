import formatAgentWithTranslation from '@/server/utils/format-agent-with-translation'
import { getUser } from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }
    const agents = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
        isEnabled: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        startMessage: true,
        useProfileData: true,
        isEnabled: true,
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
