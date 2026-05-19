import checkAdminRights from '@/server/utils/check-admin-rights.js'
import useCheckpointerDb from '@/server/utils/checkpointer-db'
// import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "id" query parameter',
      }
    }

    const runtimeConfig = useRuntimeConfig()

    const conversation = chatbotPrisma.conversation.findUnique({
      where: {
        organizationCode: runtimeConfig.public.appApiOrgCode,
        id: id,
      },
      include: { messages: { orderBy: { position: 'asc' } } },
    })

    return conversation
  })
})
