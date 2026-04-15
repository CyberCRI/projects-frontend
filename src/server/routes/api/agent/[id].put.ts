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
    const body = await readBody(event)

    const skillContents = body.skillContents || []
    delete body.skillContents

    const agent = await chatbotPrisma.agent.update({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      data: {
        ...body,
        skillContents: {
          deleteMany: { agentId: id }, // wipe existing join rows
          create: skillContents,
        },
      },
    })
    return agent
  })
})
