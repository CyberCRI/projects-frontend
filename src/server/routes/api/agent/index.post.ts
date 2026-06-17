import findSafeAgentSlug from '@/server/utils/find-safe-agent-slug.js'
import checkAdminRights from '@/server/utils/check-admin-rights.js'
import translateFields from '@/server/utils/translate-fields'
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

    // Transaction API error: A commit cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 6912 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction
    const fieldsToTranslate = []
    if (body.title)
      fieldsToTranslate.push({ field_name: 'title', type: 'text', content: body.title })
    if (body.description)
      fieldsToTranslate.push({
        field_name: 'description',
        type: 'html',
        content: body.description,
      })
    if (body.startMessage)
      fieldsToTranslate.push({
        field_name: 'startMessage',
        type: 'markdown',
        content: body.startMessage,
      })

    const translations = await translateFields(fieldsToTranslate)

    agent.agentTranslations = translations
    // console.log(agent)
    return agent
  })
})
