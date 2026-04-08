export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const _id = getQuery(event)?.id
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
      },
      // include: { promptContent: true },
    })
    // console.log(agent)
    return agent
  })
})
