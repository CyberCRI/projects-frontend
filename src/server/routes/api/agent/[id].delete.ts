import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkSuperAdminRights(event)
    const _id = getRouterParam(event, 'id')
    if (!_id) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }
    const id = parseInt(_id)
    if (isNaN(id)) {
      setResponseStatus(event, 400)
      return {
        error: 'Wrong type for "id" query parameter',
      }
    }
    try {
      await chatbotPrisma.agentSkillContent.deleteMany({
        where: {
          agentId: id,
        },
      })
    } catch {
      // nada
    }
    try {
      await chatbotPrisma.agentDocument.deleteMany({
        where: {
          agentId: id,
        },
      })
    } catch {
      // nada
    }
    const agent = await chatbotPrisma.agent.delete({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
    })
    return agent
  })
})
