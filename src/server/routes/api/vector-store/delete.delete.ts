import checkAdminRights from '~/server/utils/check-admin-rights.js'
import getVectorStore from '~/server/utils/vector-db.js'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    const { appApiOrgCode } = useRuntimeConfig().public
    const { vectorStore } = await getVectorStore()
    // return 404 if not configured
    if (!vectorStore) {
      throw createError({
        statusCode: 404,
        message: 'Vector store is not configured',
      })
    }

    const { superAdmin } = await checkAdminRights(event)

    const rawTitle = getQuery(event)?.title
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''

    if (!title) {
      setResponseStatus(event, 400)
      return { status: 'bad_request' }
    }

    let isGlobal = !!getQuery(event)?.is_global
    // only super admin can create or modify or delete global docs
    if (isGlobal && !superAdmin) isGlobal = false

    await vectorStore.delete({
      filter: {
        title: title,
        orgCode: isGlobal ? '' : appApiOrgCode,
      },
    })

    return { status: 'ok' }
  })
})
