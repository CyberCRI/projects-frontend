import { getUser } from '@/server/utils/check-admin-rights.js'
export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const user = await getUser(event)
    if (!user) {
      setResponseStatus(event, 401)
      return {
        error: 'Unauthorized',
      }
    }
    const agent = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
        isEnabled: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        startMessage: true,
        useProfileData: true,
        isEnabled: true,
      },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return agent
  })
})
