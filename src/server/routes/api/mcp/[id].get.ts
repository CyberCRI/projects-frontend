import checkAdminRights from '@/server/utils/check-admin-rights.js'
import { getMcpById } from '~/server/utils/mcp-utils'
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
    const mcp = await getMcpById(appApiOrgCode, id)

    // console.log(agent)
    if (!mcp) {
      setResponseStatus(event, 400)
      return {
        error: 'Not found',
      }
    }
    return mcp
  })
})
