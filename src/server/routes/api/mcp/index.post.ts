import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const body = await readBody(event)
    // console.log(JSON.stringify(body, null, 2))

    const mcp = await chatbotPrisma.mcp.create({
      data: {
        orgCode: appApiOrgCode,
        title: body.title,
        description: body.description,
        transport: body.transport,
        url: body.url,
        // TODO:
        command: '', //body.command,
        args: '', //body.args,
      },
    })
    // console.log(prompt)
    return mcp
  })
})
