import { getPendingRotationCount } from '~/server/utils/mcp-utils'
export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event) // TODO: superadmin ?
    const staleCount = await getPendingRotationCount(appApiOrgCode)
    return { staleCount }
  })
})
