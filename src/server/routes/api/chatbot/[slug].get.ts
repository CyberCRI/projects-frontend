import { getUser } from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
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

    const conversation = chatbotPrisma.conversation.findFirst({
      where: {
        organizationCode: appApiOrgCode,
        userId: user.id,
        agentId: agentId,
      },
      include: { messages: { orderBy: { position: 'asc' } } },
      orderBy: { lastActiveAt: 'desc' },
    })

    return { agent, conversation }
  })
})
