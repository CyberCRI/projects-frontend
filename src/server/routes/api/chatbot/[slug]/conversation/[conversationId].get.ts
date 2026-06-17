import agentFindBySlug from '@/server/utils/find-safe-agent-slug'
import { getUser } from '@/server/utils/check-admin-rights.js'
import { safeParseInt } from '@/functs/string'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  const { appApiOrgCode } = runtimeConfig.public
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

    const limit: number = safeParseInt(getQuery(event)?.limit, 0)
    const cursor: string = (getQuery(event)?.cursor ?? '') as string
    const messageRange: { take?: number; cursor?: { id: string } } = {}
    if (limit) messageRange.take = limit + 1 // take limit + 1 so the extra serve as cursor and indictor that there is more to fectch
    if (cursor) messageRange.cursor = { id: cursor }

    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    const agent = await agentFindBySlug(chatbotPrisma, slug, appApiOrgCode)

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
      include: {
        messages: {
          ...messageRange,
          where: {
            role: { in: ['user', 'assistant'] },
            content: { not: '' }, // so we filter out tool call request message
          },
          orderBy: { position: 'desc' },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    let more = null
    if (limit && conversation?.messages?.length && conversation.messages.length > limit) {
      more = conversation.messages[limit].id
      conversation.messages = conversation.messages.slice(0, limit)
    }

    return { conversation, more }
  })
})
