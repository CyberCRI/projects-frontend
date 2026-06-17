import agentFindBySlug from '@/server/utils/find-safe-agent-slug'
import { getUser } from '@/server/utils/check-admin-rights.js'
export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  const { appApiOrgCode } = runtimeConfig.public
  return defineEventHandler(async (event) => {
    // await checkAdminRights(event)
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }

    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    const agentFields: any = {
      id: true,
      title: true,
      slug: true,
      description: true,
      startMessage: true,
      useProfileData: true,
      isEnabled: true,
    }

    const agent = await agentFindBySlug(chatbotPrisma, slug, appApiOrgCode, agentFields)
    // console.log(agent)
    if (!agent) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }

    const allConversations = await chatbotPrisma.conversation.findMany({
      where: {
        organizationCode: appApiOrgCode,
        userId: user.id,
        agentId: agent.id,
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    const lastConversation = await chatbotPrisma.conversation.findFirst({
      where: {
        organizationCode: appApiOrgCode,
        userId: user.id,
        agentId: agent.id,
      },
      include: { messages: { orderBy: { position: 'desc' } } },
      orderBy: { lastActiveAt: 'desc' },
    })

    return { agent, lastConversation, allConversations }
  })
})
