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
      const skillContents = await chatbotPrisma.skillContent.deleteMany({
        where: {
          skillId: id,
        },
      })
    } catch (e) {
      // nada
    }

    const skill = await chatbotPrisma.skill.delete({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
    })

    return skill
  })
})
