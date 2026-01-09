import { z } from 'zod'
import SorbobotAPI from '@/mcp-server/sorbobot/sorbobot-api.js'
import { traceSorbobot } from '@/server/routes/api/chat-stream'
import { mcpFetch, API_BASE_URL } from '../projects/base'

const runtimeConfig = useRuntimeConfig()
const sorbobotApiUrl = runtimeConfig.public.appSorbobotApiUrl
const sorbobotApiToken = runtimeConfig.appSorbobotApiToken
const orgCode = runtimeConfig.public.appApiOrgCode

export const sorbobotIsEnabled = sorbobotApiUrl && sorbobotApiToken

const sorbobotApi = sorbobotIsEnabled ? new SorbobotAPI(sorbobotApiToken, sorbobotApiUrl) : null
export const SORBOBOT_EXTRA =
  "If the query is about researchers, research topics, parpers or publications use the 'sorbobot-api' in priority."
// console.log('Registering Sorbobot API tool')

export async function resolveResearcherProfile(sorbobotResults, extras) {
  // map researchers to their profile in Projects
  traceSorbobot('Resolving researcher profiles from Sorbobot results')
  traceSorbobot('SorbobotResults:', sorbobotResults)
  const researcherEppn = Object.values(sorbobotResults)
    .map((researcher: any) => researcher.id)
    .filter((id) => !!id)
    .map((id) => ('' + id).split('@')[0]) // get local part of eppn only)
  const idSource = 'local' // 'eppn'
  const offset = '0'
  let idMap = {}
  try {
    const profileResponse: any = await mcpFetch(
      `${API_BASE_URL}crisalid/organization/${orgCode}/researcher/search/?`,
      {
        query: {
          harvester: idSource,
          offset: offset,
          values: researcherEppn.join(','),
        },
      },
      extras
    )
    traceSorbobot('Profile response from sorbobots extender in MCP:', profileResponse)
    idMap = profileResponse.results || {}
  } catch (error) {
    console.error('Error fetching projects researcher profiles from MCP:', error)
  }
  const sorbobotResultsWithProfiles = Object.values(sorbobotResults).map((researcher: any) => {
    const res = researcher
    const resarecherId = researcher.id || ''
    const localEppn = resarecherId.split('@')[0]
    const profile = idMap[localEppn]
    const user = profile?.user
    if (user) {
      res['id'] = user.id
      res['slug'] = user.slug
      res['link_url'] = `/profile/${user.slug}/`
    } else {
      delete res['id']
    }
    return res
  })
  traceSorbobot('Sorbobot results with profiles:', sorbobotResultsWithProfiles)
  return sorbobotResultsWithProfiles
}

export const sorbobotRewriteTopics = (topics) => {
  const topicSet = new Set()
  for (const topic of topics || []) {
    const t = topic.split('/')
    if (t.length < 2) continue // skip "root"
    let topicName = t[t.length - 1].replace(/^-/, ' ').trim()
    if (t.length > 2) topicName += ` (${t[t.length - 2].replace(/^-/, ' ').trim()})`
    topicSet.add(topicName)
  }
  return Array.from(topicSet)
}

export default (server) => {
  if (!sorbobotApi) {
    console.log('Sorbobot API not configured, skipping Sorbobot tool registration')
    return
  }
  console.log('Sorbobot API initialized')

  // Add an search tool
  server.registerTool(
    'sorbobot-api',
    {
      title: 'Research, researchers, experts and science topics and publication finder',
      description:
        'Get a list of researchers and their research papers based on a query. Also get a list of research topics. Use this tool in priority if it is relevant to the user question.',
      inputSchema: { queryPrompt: z.string().describe('The research query prompt') },
      outputSchema: {
        researchers: z.array(z.object({}).describe('A researcher object')),
        research_topics: z.array(z.string().describe('A research topic')),
      },
    },
    async ({ queryPrompt }, extras) => {
      let results = { researchers: [], research_topics: [] }
      if (!sorbobotApi) {
        console.log('Sorbobot API not initialized')
        return results
      }
      try {
        await sorbobotApi.init()
        const sorbobotResults = await sorbobotApi.query(queryPrompt)
        await sorbobotApi.close()
        const researchers = await resolveResearcherProfile(sorbobotResults?.authors || [], extras)
        results = {
          researchers: researchers,
          research_topics: sorbobotRewriteTopics(sorbobotResults.search_results),
        }
      } catch (error) {
        console.error('Error querying Sorbobot:', error)
      }
      const output = results
      // console.log('MCP TOOL CALLED: sorbobot-api', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
