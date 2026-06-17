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

    const { agent, oldAgent } = await chatbotPrisma.$transaction(async (tx) => {
      const homonymous = await tx.agent.findFirst({
        where: {
          id: { not: id },
          title: body.title,
          orgCode: appApiOrgCode,
        },
      })
      if (homonymous !== null) {
        sendError(409, 'agents.title-already-used')
      }

      const sideAssistant = await tx.sideAssistant.findFirst({
        where: { agentId: id, orgCode: appApiOrgCode },
      })

      if (sideAssistant && body.isEnabled === false) {
        sendError(409, 'agents.is-used-as-side-assistant')
      }

      const oldAgent = await tx.agent.findUnique({
        where: {
          id: id,
        },
      })

      body.slug = await findSafeAgentSlug(tx, id, body.slug, appApiOrgCode)

      if (oldAgent && oldAgent.slug != body.slug) {
        // TODO: delete old aliases based on lastAccess
        await tx.agentSlugAlias.create({
          data: {
            slug: oldAgent.slug,
            orgCode: appApiOrgCode,
            agentId: oldAgent.id,
            lastAccess: new Date(),
          },
        })
      }

      const agent = await tx.agent.update({
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

      return { agent, oldAgent }
    })
    const fieldsToTranslate = []
    if (body.title && body.title != oldAgent?.title)
      fieldsToTranslate.push({ field_name: 'title', type: 'text', content: body.title })
    if (body.description && body.description != oldAgent?.description)
      fieldsToTranslate.push({
        field_name: 'description',
        type: 'html',
        content: body.description,
      })
    if (body.startMessage && body.startMessage != oldAgent?.startMessage)
      fieldsToTranslate.push({
        field_name: 'startMessage',
        type: 'markdown',
        content: body.startMessage,
      })

    const translations = await translateFields(fieldsToTranslate)

    agent.agentTranslations = translations
    return agent
  })
})
