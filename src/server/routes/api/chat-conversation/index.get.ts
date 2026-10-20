import formatAgentWithTranslation from '@/server/utils/format-agent-with-translation'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import paginate from '@/server/utils/prisma-paginate'
import { safeParseInt } from '@/functs/string'
// import format from 'pg-format'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const limit = safeParseInt(getQuery(event)?.limit, 10)
    const offset = safeParseInt(getQuery(event)?.offset, 0)
    const agentId = safeParseInt(getQuery(event)?.agentId, 0)

    const messages = !!getQuery(event)?.withMessages
    let selectAgent = {}
    if (agentId) selectAgent = { agentId }

    const conversations = await paginate(chatbotPrisma.conversation, {
      offset,
      limit,
      where: {
        organizationCode: runtimeConfig.public.appApiOrgCode,
        ...selectAgent,
      },
      include: {
        agent: {
          select: {
            title: true,
            agentTranslations: { where: { fieldName: 'title' } },
          },
        },
        messages,
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    return {
      ...conversations,
      results: conversations.results.map((c) => ({
        ...c,
        agent: formatAgentWithTranslation(c.agent, c.agent.agentTranslations),
      })),
    }
  })
})
