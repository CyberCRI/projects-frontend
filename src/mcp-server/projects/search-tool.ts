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

export async function searchTag(queryTerms: string, extras: any): Promise<number[]> {
  let results = []
  const params = {
    limit: 12,
    organizations: [orgCode],
    search: queryTerms,
  }
  try {
    const queryResult: any = await mcpFetch(
      // TODO: use org code from config
      `${API_BASE_URL}tag/${encodeURIComponent(queryTerms)}`,
      { params },
      extras
    )
    results = queryResult.results.map((item) => item.id)
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
  return results
}

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

  // Add an projects search tool
  server.registerTool(
    'search-projects',
    {
      title: 'Search Projects Tool',
      description: `Search on the platform only for projects related to a query. ${sorbobotIsEnabled ? SORBOBOT_EXTRA : ''}`,
      inputSchema: {
        queryTerms: z.string().describe('The search query terms'),
        tags: z.array(z.string()).optional().describe('List of tags to filter by'),
        sdgs: z.array(z.number()).optional().describe('List of SDGs id to filter by'),
        members: z.array(z.string()).optional().describe('List of members id to filter by'),
        // categories: z.array(z.string()).optional().describe('List of categories to filter by'),
      },
      outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of search results'),
      },
    },
    async ({ queryTerms, tags, sdgs, members /*categories */ }, extras) => {
      let tagIds: number[] = []
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          const ids = await searchTag(tag, extras)
          tagIds = tagIds.concat(ids)
        }
      }
      let results = []
      try {
        const query = {
          limit: 12,
          organizations: [orgCode],
          tagIds: tagIds || [],
          sdgs: sdgs || [],
          members: members || [],
          types: ['projects'],
          // categorieIds,
        }
        const queryResult: any = await mcpFetch(
          `${API_BASE_URL}search/${encodeURIComponent(queryTerms)}/?limit=30&organizations=${orgCode}`,
          { query },
          extras
        )
        // leaving "all cases" mapping for safety, even if this is "projects only" search
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

  // Add an projects search tool
  server.registerTool(
    'search-people',
    {
      title: 'Search People or user or members Tool',
      description: `Search on the platform only for people/users/members/owners related to a query. ${sorbobotIsEnabled ? SORBOBOT_EXTRA : ''}`,
      inputSchema: {
        queryTerms: z.string().describe('The search query terms'),
        skills: z.array(z.string()).optional().describe('List of skills to filter by'),
        sdgs: z.array(z.number()).optional().describe('List of SDGs id to filter by'),
        categories: z.array(z.string()).optional().describe('List of categories to filter by'),
      },
      outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of search results'),
      },
    },
    async ({ queryTerms, skills, sdgs }, extras) => {
      let tagIds: number[] = []
      if (skills && skills.length > 0) {
        for (const tag of skills) {
          const ids = await searchTag(tag, extras)
          tagIds = tagIds.concat(ids)
        }
      }
      let results = []
      try {
        const query = {
          limit: 12,
          organizations: [orgCode],
          skills: tagIds || [],
          sdgs: sdgs || [],
          types: ['people'],
        }
        const queryResult: any = await mcpFetch(
          `${API_BASE_URL}search/${encodeURIComponent(queryTerms)}/?limit=30&organizations=${orgCode}`,
          { query },
          extras
        )
        // leaving "all cases" mapping for safety, even if this is "people only" search
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
