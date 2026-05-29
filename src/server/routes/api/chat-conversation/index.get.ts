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

    const conversations = paginate(chatbotPrisma.conversation, {
      offset,
      limit,
      where: {
        organizationCode: runtimeConfig.public.appApiOrgCode,
      },
      include: { agent: { select: { title: true } } },
      orderBy: { lastActiveAt: 'desc' },
    })

    return conversations
  })
})
