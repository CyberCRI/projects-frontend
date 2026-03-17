import getVectorStore from '@/server/utils/vector-db.js'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import checkVectorDbRights from '@/server/utils/check-vector-db-rights.js'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)
    const title = getQuery(event)?.title as string

    const { appApiOrgCode } = useRuntimeConfig().public
    const { pool } = await getVectorStore()
    const runtimeConfig = useRuntimeConfig()
    const vectorTableName = runtimeConfig.appVectorTableName
    // return 404 if not configured
    if (!pool || !vectorTableName) {
      setResponseStatus(event, 404)
      return
    }

    const client = await pool.connect()

    console.log('title', title)
    try {
      const result = await client.query(
        `
        SELECT v.content as content, v.metadata as metadata
        FROM ${vectorTableName} v
        WHERE v.metadata->>'orgCode' = $1
        AND v.metadata->>'title' = $2
        ORDER BY v.metadata->'loc'->>'pageNumber' ASC, v.metadata->'loc'->'lines'->>'from' ASC
      `,
        [appApiOrgCode, title]
      )

      const docs = result.rows
      console.log('docs', docs.length)
      // docs.forEach((doc) => {
      //   console.log(doc.title, doc.chunks)
      // })

      return docs
    } finally {
      client.release()
    }
  })
})
