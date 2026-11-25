import formatAgentWithTranslation from '@/server/utils/format-agent-with-translation'
import { anonymizeConversation } from '@/server/utils/anonymize-conversation'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import { safeParseInt } from '@/functs/string'

import { getUser as fetchUser } from 'shared-projects-frontend/apis'
// import useCheckpointerDb from '@/server/utils/checkpointer-db'
// import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const { user } = await checkAdminRights(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }

    // function pickFirstIfArray(x: string | string[] | undefined | null): string | undefined | null {
    //   if (Array.isArray(x)) return x[0]
    //   return x
    // }

    const limit: number = safeParseInt(getQuery(event)?.limit, 0)
    const cursor: string = (getQuery(event)?.cursor ?? '') as string

    const messageRange: { take?: number; cursor?: { id: string } } = {}
    if (limit) messageRange.take = limit + 1 // take limit + 1 so the extra serve as cursor and indictor that there is more to fectch
    if (cursor) messageRange.cursor = { id: cursor }

    const runtimeConfig = useRuntimeConfig()

    const conversation = await chatbotPrisma.conversation.findUnique({
      where: {
        organizationCode: runtimeConfig.public.appApiOrgCode,
        id: id,
      },
      include: {
        messages: { ...messageRange, orderBy: { position: 'desc' } },
        agent: {
          select: {
            title: true,
            agentTranslations: { where: { fieldName: 'title' } },
          },
        },
      },
    })
    if (!conversation) {
      setResponseStatus(event, 404)
      return { error: 'Conversation not found' }
    }
    let more = null
    if (limit && conversation.messages.length && conversation.messages.length > limit) {
      more = conversation.messages[limit].id
      conversation.messages = conversation.messages.slice(0, limit)
    }

    const userContextContent = await fetchUser(
      runtimeConfig.public.appApiOrgCode,
      conversation.userId,
      { headers: { Authorization: getRequestHeader(event, 'authorization') } }
    )

    //    console.log('userContext', userContextContent)

    return {
      conversation: anonymizeConversation(
        {
          ...conversation,
          agent: formatAgentWithTranslation(
            conversation.agent,
            conversation.agent.agentTranslations
          ),
        },
        user.id,
        { userContextContent, salt: runtimeConfig.appConversationAliasSalt as string }
      ),
      more,
    }
  })
})
