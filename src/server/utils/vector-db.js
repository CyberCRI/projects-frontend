import { PGVectorStore } from '@langchain/community/vectorstores/pgvector'
import { OpenAIEmbeddings } from '@langchain/openai' // Or any other embedding model
// import { Client } from 'pg'
import { parse } from 'pg-connection-string'
import pg from 'pg'

export default async () => {
  const runtimeConfig = useRuntimeConfig()
  // 1. Configure the database connection
  const connectionString = runtimeConfig.appVectorDbUrl
  const modelName = runtimeConfig.appVectorEmbeddingModel
  const vectorDimensions = runtimeConfig.appVectorEmbeddingDimensions
    ? parseInt(runtimeConfig.appVectorEmbeddingDimensions)
    : null
  const apiKey = runtimeConfig.appVectorEmbeddingApiKey
  const vectorTableName = runtimeConfig.appVectorTableName

  let vectorStore = null
  let pool = null
  try {
    if (!connectionString || !modelName || !vectorDimensions || !apiKey || !vectorTableName) {
      throw new Error('Missing required configuration for vector store.')
    }

    // 2. Create a PgPool or Client instance (LangChain accepts both, but Pool is better for production)
    // For simplicity in initialization, we'll pass the connection string directly to the store constructor
    // which handles the connection internally for setup.

    const embeddings = new OpenAIEmbeddings({
      modelName,
      apiKey,
    })

    pool = new pg.Pool(parse(connectionString))

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

    // 3. Initialize the VectorStore - skip if not needed
    vectorStore = await PGVectorStore.initialize(
      embeddings,
      config
      // Optional: Specify a custom table name if you don't want the default 'langchain_pg_embedding'
      // tableName: "my_custom_table",
      // Optional: Use JSONB for metadata (default is usually JSONB in newer versions)
      // useJsonb: true,
    )

    console.log('Database connection established and tables initialized.')

    // 4. (Optional) Add some documents to verify it works
    // const docs = [
    //   new Document({ pageContent: "Hello world", metadata: { source: "test" } }),
    // ];
    // await vectorStore.addDocuments(docs);
  } catch (error) {
    console.error('Error initializing vector store:', error)
    // Handle the error as needed, e.g., fallback to an in-memory store or disable vector features
  }

  return { pool, vectorStore }
}
