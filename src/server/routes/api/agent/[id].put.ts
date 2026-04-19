import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'
import slugify from '@sindresorhus/slugify'

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

    const slug = slugify(body.title)
    body.slug = slug

    const skillContents = body.skillContents || []
    delete body.skillContents

    const documents = body.documents || []
    delete body.documents

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
        documents: {
          deleteMany: { agentId: id }, // wipe existing join rows
          create: documents,
        },
      },
    })
    return agent
  })
})
