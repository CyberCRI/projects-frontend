import formatAgentWithTranslation from '@/server/utils/format-agent-with-translation'
import findSafeAgentSlug from '@/server/utils/find-safe-agent-slug.js'
import { translateAgentFields } from '@/server/utils/translate-fields'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import slugify from '@sindresorhus/slugify'

function sendError(code, message) {
  throw createError({
    statusCode: code,
    message: message,
  })
}

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
      const homonym = await tx.agent.findFirst({
        where: {
          title: body.title,
          orgCode: appApiOrgCode,
        },
      })
      if (homonym !== null) {
        sendError(409, 'agents.title-already-used')
      }
      body.slug = await findSafeAgentSlug(tx, null, body.slug, appApiOrgCode)
      const agent = await tx.agent.create({
        data: { ...body, orgCode: appApiOrgCode },
      })

      return agent
    })

    const translations = await translateAgentFields(agent)
    // console.log(agent)
    return formatAgentWithTranslation(agent, translations)
  })
})
