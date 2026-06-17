import type { SorbobotAuthor, SorbobotResponseData } from '~/mcp-server/sorbobot/sorbobot-api'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { mcpOptions, resultFromTool } from '../projects/base'
import SorbobotAPI from '~/mcp-server/sorbobot/sorbobot-api'
import type { HarvesterType } from '~/interfaces/researcher'
import { searchResearcher } from '~/api/crisalid.service'
import { z } from 'zod'

const runtimeConfig = useRuntimeConfig()
const sorbobotApiUrl = runtimeConfig.public.appSorbobotApiUrl
const sorbobotApiToken = runtimeConfig.appSorbobotApiToken

const orgCode = runtimeConfig.public.appApiOrgCode
const appSorbobotApiTrace = runtimeConfig.appSorbobotApiTrace

export const sorbobotIsEnabled = sorbobotApiUrl && sorbobotApiToken

const traceSorbobot = (...args) => {
  if (appSorbobotApiTrace) {
    console.log('[Sorbobot TRACE]', ...args)
  }
}

export const SORBOBOT_EXTRA =
  "If the query is about researchers, research topics, parpers or publications use the 'sorbobot-api' in priority."
// console.log('Registering Sorbobot API tool')

async function resolveResearcherProfile(
  sorbobotResults: SorbobotResponseData['data']['authors'],
  extras
): Promise<SorbobotAuthor[]> {
  // map researchers to their profile in Projects
  traceSorbobot('Resolving researcher profiles from Sorbobot results')
  traceSorbobot('SorbobotResults:', sorbobotResults)
  const researcherEppn = Object.values(sorbobotResults)
    .map((researcher) => researcher.id)
    .filter((id) => !!id)
    .map((id) => ('' + id).split('@')[0]) // get local part of eppn only)

  const idSource: HarvesterType = 'local' // 'eppn'

  const opts = mcpOptions(extras)
  return searchResearcher(orgCode, {
    ...opts,
    query: {
      harvester: idSource,
      values: researcherEppn.join(','),
    },
  })
    .then((profileResponse) => {
      traceSorbobot('Profile response from sorbobots extender in MCP:', profileResponse)

      const sorbobotResultsWithProfiles = Object.values(sorbobotResults).map((researcher) => {
        const res = researcher
        const resarecherId = researcher.id || ''
        const localEppn = resarecherId.split('@')[0]
        const profile = profileResponse.results[localEppn]
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
    })
    .catch((error) => {
      console.error('Error fetching projects researcher profiles from MCP:', error)
      return []
    })
}

const sorbobotRewriteTopics = (topics: string[]) => {
  const topicSet = new Set<string>()
  for (const topic of topics || []) {
    const t = topic.split('/')
    if (t.length < 2) continue // skip "root"
    let topicName = t[t.length - 1].replace(/^-/, ' ').trim()
    if (t.length > 2) topicName += ` (${t[t.length - 2].replace(/^-/, ' ').trim()})`
    topicSet.add(topicName)
  }
  return Array.from(topicSet)
}

export default (server: McpServer) => {
  if (!sorbobotIsEnabled) {
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
    resultFromTool(async ({ queryPrompt }, extras) => {
      const sorbobotApi = new SorbobotAPI(sorbobotApiToken, sorbobotApiUrl)

      let results = { researchers: [], research_topics: [] }

      try {
        await sorbobotApi.init()
        const sorbobotResults = await sorbobotApi.query(queryPrompt)
        const researchers = await resolveResearcherProfile(sorbobotResults?.authors || {}, extras)
        results = {
          researchers: researchers,
          research_topics: sorbobotRewriteTopics(sorbobotResults.search_results),
        }
      } finally {
        await sorbobotApi.close()
      }

      return results
    })
  )
}
