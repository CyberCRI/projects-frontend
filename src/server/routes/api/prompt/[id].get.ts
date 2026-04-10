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
    const prompt = await chatbotPrisma.prompt.findUnique({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      include: { promptContents: true },
    })

    // console.log(agent)
    if (!prompt) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }
    return prompt
  })
})
