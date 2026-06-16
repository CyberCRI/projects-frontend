import checkAdminRights from '@/server/utils/check-admin-rights.js'
import findSafeAgentSlug from '@/server/utils/agent-safe-slug.js'
import slugify from '@sindresorhus/slugify'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const body = await readBody(event)

    const slug = slugify(body.title)
    body.slug = slug

    if (!body.skillContents?.length) delete body.skillContents
    else body.skillContents = { create: body.skillContents }
    if (!body.documents?.length) delete body.documents
    else body.documents = { create: body.documents }

    const agent = await chatbotPrisma.$transaction(async (tx) => {
      body.slug = await findSafeAgentSlug(tx, null, body.slug, appApiOrgCode)
      const agent = await tx.agent.create({
        data: { ...body, orgCode: appApiOrgCode },
      })
      return agent
    })
    // console.log(agent)
    return agent
  })
})
