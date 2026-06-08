import { getUser } from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const runtimeConfig = useRuntimeConfig()
  const { appApiOrgCode } = runtimeConfig.public
  return defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }

    // TODO: show disabled agents for admins ?
    const agents = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
        isEnabled: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isEnabled: true,
      },
    })

    return { agents }
  })
})
