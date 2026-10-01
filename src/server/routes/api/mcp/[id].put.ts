import { redactApiKey, updateApikey } from '~/server/utils/mcp-utils'
import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
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

    const data = updateApikey({
      title: body.title,
      description: body.description,
      transport: body.transport,
      url: body.url,
      // TODO:
      // command: body.command,
      // args: body.args,
      apiKey: body.apiKey,
    })

    const mcp = await chatbotPrisma.mcp.update({
      where: {
        id: id,
        orgCode: appApiOrgCode,
      },
      data,
    })

    return redactApiKey(mcp)
  })
})
