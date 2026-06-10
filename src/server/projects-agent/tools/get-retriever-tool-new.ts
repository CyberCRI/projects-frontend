import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { createRetrieverTool } from '@langchain/classic/tools/retriever'
import { BaseRetriever } from '@langchain/core/retrievers'

const runtimeConfig = useRuntimeConfig()
const { appVectorToolPrompt } = runtimeConfig
const { appApiOrgCode } = runtimeConfig.public

export const PROJECTS_DEFAULT_VECTOR_STORE_KEY = 'ProjectsDefaultVectorStoreKey'

export const MAX_RETRIEVED_DOCS = 5

// Freaky pgvector retirever doesn't support "or filtering"...
// so we make one retriever for "global" doc and one for "local" docs and merger retsults
export default function getRetrieverTool(agentData, vectorStore) {
  traceLangchain(`Configure vector tool with prompt "${appVectorToolPrompt}"`)

  const agentDocuments = (agentData.documents || []).filter(
    (d) => d.vectorStoreKey === PROJECTS_DEFAULT_VECTOR_STORE_KEY
  )

  const globalTitles = agentDocuments.filter((d) => d.isGlobal).map((d) => d.documentTitle)
  traceLangchain(
    `Agent has acces to global docs : ${(globalTitles || ['NONE']).map((title) => `"${title}"`).join(', ')}`
  )
  const orgTitles = agentDocuments.filter((d) => !d.isGlobal).map((d) => d.documentTitle)
  traceLangchain(
    `Agent has acces to org local docs : ${(orgTitles || ['NONE']).map((title) => `"${title}"`).join(', ')}`
  )
  // console.log('--------------globalTitles', globalTitles)
  // console.log('--------------orgTitles', orgTitles)

  // Custom retriever that runs up to two JSONB-containment-safe queries and merges results
  const mergedRetriever = new (class extends BaseRetriever {
    lc_namespace = ['custom', 'merged_pgvector_retriever']

    override async _getRelevantDocuments(query) {
      const searches = []

      if (globalTitles.length) {
        searches.push(
          vectorStore.similaritySearchWithScore(query, MAX_RETRIEVED_DOCS, {
            orgCode: '',
            title: { in: globalTitles },
          })
        )
      }

      if (orgTitles.length) {
        searches.push(
          vectorStore.similaritySearchWithScore(query, MAX_RETRIEVED_DOCS, {
            orgCode: appApiOrgCode,
            title: { in: orgTitles },
          })
        )
      }

      if (searches.length === 0) return []

      const results = await Promise.all(searches)

      // Merge, deduplicate by pageContent
      const seen = new Set()
      const merged = []
      for (const docsWithScore of results) {
        for (const [doc, score] of docsWithScore) {
          if (!seen.has(doc.pageContent)) {
            seen.add(doc.pageContent)
            merged.push({ doc, score })
          }
        }
      }

      // sort by score, keep top 5
      // pgvector cosine distance: lower score = more similar, so sort ascending
      merged.sort((a, b) => a.score - b.score)

      return merged.slice(0, MAX_RETRIEVED_DOCS).map(({ doc }) => doc)
    }
  })()

  const retrieverTool = createRetrieverTool(mergedRetriever, {
    name: 'pgvector_tool',
    description: appVectorToolPrompt,
  })

  return retrieverTool
}
