import { getUser } from '@/server/utils/check-admin-rights.js'
export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public

  return defineEventHandler(async (event) => {
    const withLastConversation = !!getQuery(event)?.withLastConversation
    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    const sideAssistant = await chatbotPrisma.sideAssistant.findFirst({
      where: { orgCode: appApiOrgCode },
      include: {
        agent: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            startMessage: true,
            useProfileData: true,
            isEnabled: true,
          },
        },
      },
    })

    let lastConversation = null
    if (withLastConversation && sideAssistant?.agent) {
      lastConversation = await chatbotPrisma.conversation.findFirst({
        where: {
          organizationCode: appApiOrgCode,
          userId: user.id,
          agentId: sideAssistant.agent.id,
        },
        include: { messages: { orderBy: { position: 'desc' } } },
        orderBy: { lastActiveAt: 'desc' },
      })
    }
    return { sideAssistant, lastConversation }
  })
})
