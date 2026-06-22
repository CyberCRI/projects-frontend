import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'

const runtimeConfig = useRuntimeConfig()
const { appVectorToolPrompt } = runtimeConfig
const { appApiOrgCode } = runtimeConfig.public

// TODO: fix import issue (useNuxtRuntime in dependncies)
// import { PROJECTS_DEFAULT_VECTOR_STORE_KEY } from '@/composables/useVectorStore'
export const PROJECTS_DEFAULT_VECTOR_STORE_KEY = 'ProjectsDefaultVectorStoreKey'

export default function getRetrieverTool(agentData, vectorStore) {
  traceLangchain(`Configure vector tool with prompt "${appVectorToolPrompt}"`)

  const agentDocuments = (agentData.documents || [])
    .filter((d) => d.vectorStoreKey === PROJECTS_DEFAULT_VECTOR_STORE_KEY)
    .map((d) => d.documentTitle)

  const retriever = vectorStore.asRetriever({
    k: 5,
    filter: {
      orgCode: appApiOrgCode,
      title: { $in: agentDocuments },
    },
  })

  const retrieverTool = createRetrieverTool(retriever, {
    name: 'pgvector_tool',
    description: appVectorToolPrompt,
  })

  return retrieverTool
}
