import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const mcp = await chatbotPrisma.mcp.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return mcp
  })
})
