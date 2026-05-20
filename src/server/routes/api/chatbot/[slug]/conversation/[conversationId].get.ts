import { getUser } from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    // await checkAdminRights(event)
    const slug = getRouterParam(event, 'slug')
    if (!slug) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "slug" query parameter',
      }
    }

    const conversationId = getRouterParam(event, 'conversationId')
    if (!conversationId) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "conversationId" query parameter',
      }
    }

    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    // findUnique dont work because slug is not globally unique
    const agent = await chatbotPrisma.agent.findFirst({
      where: {
        slug: slug,
        orgCode: appApiOrgCode,
      },
    })
    const runtimeConfig = useRuntimeConfig()

    // console.log(agent)
    if (!agent) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }

    const conversation = await chatbotPrisma.conversation.findFirst({
      where: {
        id: conversationId,
        organizationCode: appApiOrgCode,
        userId: user.id,
        agentId: agent.id,
      },
      include: { messages: { orderBy: { position: 'asc' } } },
      orderBy: { lastActiveAt: 'desc' },
    })

    return { conversation }
  })
})
