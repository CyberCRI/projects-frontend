export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
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
    const skill = await chatbotPrisma.skill.findUnique({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      include: { skillContents: { orderBy: { version: 'desc' } } },
    })

    // console.log(agent)
    if (!skill) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }
    return skill
  })
})
