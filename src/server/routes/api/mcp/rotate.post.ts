import { rotateAll } from '~/server/utils/mcp-utils'
export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event) // TODO: superadmin ?
    await rotateAll(appApiOrgCode)
    return { success: true }
  })
})
