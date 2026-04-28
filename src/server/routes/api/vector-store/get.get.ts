import getVectorStore from '~/server/utils/vector-db.js'
import checkVectorDbRights from '~/server/utils/check-vector-db-rights.js'
import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)
    const rawTitle = getQuery(event)?.title
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''

    if (!title) {
      setResponseStatus(event, 400)
      return {
        error: 'Missing required "title" query parameter',
      }
    }
    const { appApiOrgCode } = useRuntimeConfig().public
    const { pool } = await getVectorStore()
    const runtimeConfig = useRuntimeConfig()
    const vectorTableName = runtimeConfig.appVectorTableName
    // return 404 if not configured
    if (!pool || !vectorTableName) {
      throw createError({
        statusCode: 404,
        message: 'Vector store is not configured',
      })
    }

    const client = await pool.connect()

    try {
      const sql = format(
        `
      SELECT v.content as content, v.metadata as metadata
      FROM %I v
      WHERE v.metadata->>'orgCode' = $1
      AND v.metadata->>'title' = $2
      ORDER BY v.metadata->'loc'->'pageNumber' ASC, v.metadata->'loc'->'lines'->'from' ASC
    `,
        vectorTableName
      )
      const result = await client.query(sql, [appApiOrgCode, title])

      const docs = result.rows
      return docs
    } finally {
      client.release()
    }
  })
})
