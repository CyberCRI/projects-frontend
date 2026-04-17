import checkSuperAdminRights from '@/server/utils/check-super-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkSuperAdminRights(event)
    const body = await readBody(event)

    if (!body.skillContents?.length) delete body.skillContents
    else body.skillContents = { create: body.skillContents }
    if (!body.documents?.length) delete body.documents
    else body.documents = { create: body.documents }

    const agent = await chatbotPrisma.agent.create({
      data: { ...body, orgCode: appApiOrgCode },
    })
    // console.log(agent)
    return agent
  })
})
