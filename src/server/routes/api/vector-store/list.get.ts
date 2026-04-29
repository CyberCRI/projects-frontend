import checkVectorDbRights from '~/server/utils/check-vector-db-rights.js'
import getVectorStore from '~/server/utils/vector-db.js'
import format from 'pg-format'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)

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
      SELECT distinct(v.metadata->>'title') as title, count(*) as chunks
      FROM %I v
      WHERE v.metadata->>'orgCode' = $1
      GROUP BY v.metadata->>'title'
    `,
        vectorTableName
      )
      const result = await client.query(sql, [appApiOrgCode])
      const docs = result.rows
      return docs
    } finally {
      client.release()
    }
  })
})
