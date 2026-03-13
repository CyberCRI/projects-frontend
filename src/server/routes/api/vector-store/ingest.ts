import getVectorStore from '@/server/utils/vector-db.js'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import checkVectorDbRights from '@/server/utils/check-vector-db-rights.js'

export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    await checkVectorDbRights(event)

    const { appApiOrgCode } = useRuntimeConfig().public
    const vectorStore = await getVectorStore()
    // return 404 if not configured
    if (!vectorStore) {
      setResponseStatus(event, 404)
      return
    }

    const formData = await readFormData(event)

    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file || !title) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: file and title',
      })
    }

    // const arrayBuffer = await file.arrayBuffer()
    // const buffer = Buffer.from(arrayBuffer)
    const loader = new PDFLoader(file)

    const fileDocs = await loader.load()
    const extraMetadata = {
      title: title,
      timestamp: new Date().toISOString(),
      orgCode: appApiOrgCode,
    }
    const fileDocsWithMeta = fileDocs.map((d) => ({
      ...d,
      metadata: { ...d.metadata, ...extraMetadata },
    }))

    // chunking express
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 })
    const chunks = await splitter.splitDocuments(fileDocsWithMeta)

    await vectorStore.delete({
      filter: {
        metadata: {
          title: extraMetadata.title,
          orgCode: extraMetadata.orgCode,
        },
      },
    })

    await vectorStore.addDocuments(chunks)

    return { status: 'ok', chunks }
  })
})
