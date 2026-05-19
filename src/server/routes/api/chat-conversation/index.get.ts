import checkAdminRights from '@/server/utils/check-admin-rights.js'
import format from 'pg-format'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const conversations = chatbotPrisma.conversation.findMany({
      where: {
        organizationCode: runtimeConfig.public.appApiOrgCode,
      },
      orderBy: { lastActiveAt: 'desc' },
    })

    return conversations
  })
})
