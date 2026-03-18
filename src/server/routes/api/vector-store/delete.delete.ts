import getVectorStore from '@/server/utils/vector-db.js'
import checkVectorDbRights from '@/server/utils/check-vector-db-rights.js'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)
    const title = getQuery(event)?.title as string

    const { appApiOrgCode } = useRuntimeConfig().public
    const { vectorStore } = await getVectorStore()
    // return 404 if not configured
    if (!vectorStore) {
      setResponseStatus(event, 404)
      return
    }

    await vectorStore.delete({
      filter: {
        title: title,
        orgCode: appApiOrgCode,
      },
    })

    return { status: 'ok' }
  })
})
