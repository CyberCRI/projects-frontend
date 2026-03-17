import getVectorStore from '@/server/utils/vector-db.js'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import checkVectorDbRights from '@/server/utils/check-vector-db-rights.js'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)

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

    try {
      const result = await client.query(
        `
        SELECT distinct(v.metadata->>'title') as title, count(*) as chunks
        FROM ${vectorTableName} v
        WHERE v.metadata->>'orgCode' = $1
        GROUP BY v.metadata->>'title'
      `,
        [appApiOrgCode]
      )

      const docs = result.rows
      docs.forEach((doc) => {
        console.log(doc.title, doc.chunks)
      })

      return docs
    } finally {
      client.release()
    }
  })
})
