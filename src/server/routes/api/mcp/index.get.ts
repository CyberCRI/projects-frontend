import checkAdminRights from '@/server/utils/check-admin-rights.js'
import { getAllMcp } from '~/server/utils/mcp-utils'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)
    const mcp = await getAllMcp(appApiOrgCode)
    // console.log(agent)
    return mcp
  })
})
