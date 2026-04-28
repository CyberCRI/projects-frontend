import { PGVectorStore } from '@langchain/community/vectorstores/pgvector'
import { OpenAIEmbeddings } from '@langchain/openai'

// Or any other embedding model

import { parse } from 'pg-connection-string'
import pg from 'pg'

let vectorStore = null
let pool = null

export default async () => {
  const runtimeConfig = useRuntimeConfig()
  const connectionString = runtimeConfig.appVectorDbUrl
  const modelName = runtimeConfig.appVectorEmbeddingModel
  const vectorDimensions = runtimeConfig.appVectorEmbeddingDimensions
    ? parseInt(runtimeConfig.appVectorEmbeddingDimensions)
    : null
  const apiKey = runtimeConfig.appVectorEmbeddingApiKey
  const vectorTableName = runtimeConfig.appVectorTableName

  try {
    if (!connectionString || !modelName || !vectorDimensions || !apiKey || !vectorTableName) {
      throw new Error('Missing required configuration for vector store.')
    }

    if (!pool) {
      pool = new pg.Pool(parse(connectionString))
    }

    if (!vectorStore) {
      const embeddings = new OpenAIEmbeddings({
        modelName,
        apiKey,
      })

      const config = {
        pool,
        dimensions: vectorDimensions,
        tableName: vectorTableName,
        columns: {
          idColumnName: 'id',
          vectorColumnName: 'vector',
          contentColumnName: 'content',
          metadataColumnName: 'metadata',
        },
        // supported distance strategies: cosine (default), innerProduct, or euclidean
        distanceStrategy: 'cosine', // as DistanceStrategy,
      }

      vectorStore = await PGVectorStore.initialize(
        embeddings,
        config
        // Optional: Specify a custom table name if you don't want the default 'langchain_pg_embedding'
        // tableName: "my_custom_table",
        // Optional: Use JSONB for metadata (default is usually JSONB in newer versions)
        // useJsonb: true,
      )

      console.log('Database connection established and tables initialized.')
    }
  } catch (error) {
    console.error('Error initializing vector store:', error)
    // Handle the error as needed, e.g., fallback to an in-memory store or disable vector features
  }

  return { pool, vectorStore }
}
