import { z } from 'zod'
import { mcpFetch, API_BASE_URL, orgCode } from './base'
import { PROJECT_PREVIEW_OUTPUT_SCHEMA, mapProjectPreview } from './project-tool'
import {
  USER_PREVIEW_OUTPUT_SCHEMA,
  mapUserPreview,
  PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
  mapPeopleGroupPreview,
} from './people-tool'
import { sorbobotIsEnabled, SORBOBOT_EXTRA } from '../sorbobot/sorbobot-tool'
export default (server) => {
  // Add an search tool
  server.registerTool(
    'search',
    {
      title: 'Search Tool',
      description: `Search on the platform for projects, people profile (user) and groups (of users) related to a query. ${sorbobotIsEnabled ? SORBOBOT_EXTRA : ''}`,
      inputSchema: { queryTerms: z.string().describe('The search query terms') },
      outputSchema: {
        results: z
          .array(
            z.union([
              PROJECT_PREVIEW_OUTPUT_SCHEMA,
              USER_PREVIEW_OUTPUT_SCHEMA,
              PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
            ])
          )
          .describe('The list of search results'),
      },
    },
    async ({ queryTerms }, extras) => {
      let results = []
      try {
        const query = {
          limit: 12,
          organizations: [orgCode],
        }
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}search/${encodeURIComponent(queryTerms)}/?limit=30&organizations=${orgCode}`,
          { query },
          extras
        )
        results = queryResult.results.map((item) => {
          if (item.type === 'project') {
            const p = item.project
            return mapProjectPreview(p)
          } else if (item.type === 'user') {
            const u = item.user
            return mapUserPreview(u)
          } else if (item.type === 'people_group') {
            const g = item.people_group
            return mapPeopleGroupPreview(g)
          }
        })
      } catch (error) {
        console.error('Error fetching search results:', error)
      }
      const output = { results } // skip pagination for simplicity
      // console.log('MCP TOOL CALLED: search', { query, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
