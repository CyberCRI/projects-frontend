import checkAdminRights from '@/server/utils/check-admin-rights.js'
import slugify from '@sindresorhus/slugify'

function sendError(code, message) {
  // setResponseStatus(event, code)
  // return {
  //   error: 'message',
  // }
  throw createError({
    statusCode: code,
    message: message,
  })
}

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const _id = getRouterParam(event, 'id')
    if (!_id) {
      sendError(400, 'Missing required "id" query parameter')
    }
    const id = parseInt(_id)
    if (isNaN(id)) {
      sendError(400, 'Wrong type for "id" query parameter')
    }
    const body = await readBody(event)

    const slug = slugify(body.title)
    body.slug = slug

    const skillContents = body.skillContents || []
    delete body.skillContents

    const documents = body.documents || []
    delete body.documents

    const agent = await chatbotPrisma.$transaction(async (tx) => {
      const sideAssistant = await tx.sideAssistant.findFirst({
        where: { agentId: id, orgCode: appApiOrgCode },
      })

      if (sideAssistant && body.isEnabled === false) {
        sendError(409, 'Agent is used as a side assistant')
      }
      return await tx.agent.update({
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
          documents: {
            deleteMany: { agentId: id }, // wipe existing join rows
            create: documents,
          },
        },
      })
    })
    return agent
  })
})
