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
    const body = await readBody(event)

    const lastContent = await chatbotPrisma.promptContent.findFirst({
      where: {
        promptId: id,
      },
      orderBy: {
        version: 'desc',
      },
    })

    const version = lastContent.version + 1

    const prompt = await chatbotPrisma.prompt.update({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      data: {
        promptContents: {
          create: [{ content: body.content, version }],
        },
      },
    })

    return prompt
  })
})
