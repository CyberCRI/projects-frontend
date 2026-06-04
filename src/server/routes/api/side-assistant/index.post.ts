import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const body = await readBody(event)

    const _agentId = body.agentId
    const agentId = parseInt(_agentId)
    if (isNaN(agentId)) {
      setResponseStatus(event, 400)
      return {
        error: 'Wrong type for "agentId" query parameter',
      }
    }
    const result = await chatbotPrisma.$transaction(async (tx) => {
      let sideAssistant = await tx.sideAssistant.findFirst({
        where: { orgCode: appApiOrgCode },
      })

      if (agentId === 0) {
        await tx.sideAssistant.deleteMany({
          where: { orgCode: appApiOrgCode },
        })
        sideAssistant = null
      } else {
        if (sideAssistant?.id) {
          sideAssistant = await tx.sideAssistant.update({
            data: { ...sideAssistant, orgCode: appApiOrgCode },
            where: { id: sideAssistant.id },
          })
        } else {
          sideAssistant = await tx.sideAssistant.create({
            data: { agentId, orgCode: appApiOrgCode },
          })
        }
      }
      return sideAssistant
    })
    // console.log(agent)
    return result
  })
})
