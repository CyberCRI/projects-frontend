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
    const agent = await chatbotPrisma.agent.findUnique({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: {
          include: { prompt: true },
        },
        skillContents: { include: { skillContent: { include: { skill: true } } } },
        document: true,
        mcps: true,
      },
    })

    // console.log(agent)
    if (!agent) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }
    return agent
  })
})
