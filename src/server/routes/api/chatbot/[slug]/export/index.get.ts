import checkAdminRights from '@/server/utils/check-admin-rights.js'
import agentFindBySlug from '@/server/utils/find-safe-agent-slug'
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

    const limit: number = safeParseInt(getQuery(event)?.limit, 0)
    const cursor: string = (getQuery(event)?.cursor ?? '') as string
    const messageRange: { take?: number; cursor?: { id: string } } = {}
    if (limit) messageRange.take = limit + 1 // take limit + 1 so the extra serve as cursor and indictor that there is more to fectch
    if (cursor) messageRange.cursor = { id: cursor }

    const { user } = await checkAdminRights(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    const agent = await agentFindBySlug(chatbotPrisma, slug, appApiOrgCode, {
      promptContent: {
        include: { prompt: true },
      },
      skillContents: { include: { skillContent: { include: { skill: true } } } },
      documents: true,
      mcps: true,
    })

    // console.log(agent)
    if (!agent) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }
    console.log('where', {
      organizationCode: appApiOrgCode,
      userId: user.id,
      agentId: agent.id,
    })
    const conversation = await chatbotPrisma.conversation.findFirst({
      where: {
        organizationCode: appApiOrgCode,
        userId: user.id,
        agentId: agent.id,
      },
      include: {
        messages: {
          orderBy: { position: 'asc' },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    })
    console.log('conversation', conversation)

    return { agent, conversation }
  })
})
