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
    const id = _id

    const body = await readBody(event)

    const data = updateApikey({
      id: _id,
      title: body.title,
      description: body.description,
      transport: body.transport,
      url: body.url,
      // TODO:
      // command: body.command,
      // args: body.args,
      apiKey: body.apiKey,
      authHeader: body.authHeader,
    })

    console.log('data', data)

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
