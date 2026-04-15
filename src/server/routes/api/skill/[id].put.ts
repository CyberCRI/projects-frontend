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

    const lastContent = await chatbotPrisma.skillContent.findFirst({
      where: {
        skillId: id,
      },
      orderBy: {
        version: 'desc',
      },
    })

    const version = lastContent.version + 1

    const skill = await chatbotPrisma.skill.update({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      data: {
        skillContents: {
          create: [{ content: body.content, version }],
        },
      },
    })

    return skill
  })
})
