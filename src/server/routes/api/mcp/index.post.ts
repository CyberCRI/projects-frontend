import { redactApiKey, updateApikey, createId } from '~/server/utils/mcp-utils'
import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const body = await readBody(event)
    // console.log(JSON.stringify(body, null, 2))

    const data = updateApikey({
      id: createId(),
      orgCode: appApiOrgCode,
      title: body.title,
      description: body.description,
      transport: body.transport,
      url: body.url,
      apiKey: body.apiKey,
      // TODO:
      command: '', //body.command,
      args: '',
    })

    const mcp = await chatbotPrisma.mcp.create({
      data,
    })
    // console.log(prompt)
    return redactApiKey(mcp)
  })
})
