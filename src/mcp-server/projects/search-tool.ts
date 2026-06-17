import { SORBOBOT_EXTRA, sorbobotIsEnabled } from '../sorbobot/sorbobot-tool'
import { searchAll, searchProjects, searchUser } from '~/api/search.service'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp'
import { mapPeopleGroupPreview, mapUserPreview } from './people-tool'
import { getAllTagsById } from '~/api/tag-classification.service'
import type { Config } from '~/api/tag-classification.service'
import { mapProjectPreview } from './project-tool'
import { mcpOptions, orgCode } from './base'
import { z } from 'zod'

export async function getAllTags(tagsId: number[], extras): Promise<number[]> {
  const opts = mcpOptions(extras) as Config

  return await getAllTagsById(tagsId, opts)
    .then((results) => results.results.map((tag) => tag.id))
    .catch((error) => {
      console.error('Error fetching tags:', error)
      return []
    })
}

export default (server: McpServer) => {
  // Add an search tool
  server.registerTool(
    'search',
    {
      title: 'Search Tool',
      description: `Search on the platform for projects, people profile (user) and groups (of users) related to a query. ${sorbobotIsEnabled ? SORBOBOT_EXTRA : ''}`,
      inputSchema: { queryTerms: z.string().describe('The search query terms') },
      /*outputSchema: {
        results: N.array(
          z.union([
            PROJECT_PREVIEW_OUTPUT_SCHEMA,
            USER_PREVIEW_OUTPUT_SCHEMA,
            PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
          ])
        ).describe('The list of search results'),
      },*/
    },
    async ({ queryTerms }, extras) => {
      let results = []
      try {
        const opts = mcpOptions(extras)
        const queryResult = await searchAll(queryTerms, {
          ...opts,
          query: {
            limit: 12,
            organizations: [orgCode],
          },
        })
        results = queryResult.results.map((item) => {
          switch (item.type) {
            case 'people_group':
              return mapPeopleGroupPreview(item.people_group)
            case 'user':
              return mapUserPreview(item.user)
            case 'project':
              return mapProjectPreview(item.project)
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
      /*outputSchema: {
        results: N.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of search results'),
      },*/
    },
    async ({ queryTerms, tags, sdgs, members /*categories */ }, extras) => {
      let tagIds: number[] = []
      if (tags && tags.length > 0) {
        tagIds = await getAllTags(tags, extras)
      }
      let results = []
      try {
        const opts = mcpOptions(extras)
        const queryResult = await searchProjects(queryTerms, {
          ...opts,
          query: {
            limit: 12,
            organizations: [orgCode],
            tags: tagIds || [],
            sdgs: sdgs || [],
            members: members || [],
          },
        })
        results = queryResult.results.map((item) => mapProjectPreview(item.project))
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
      /*outputSchema: {
        results: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe('The list of search results'),
        },*/
    },
    async ({ queryTerms, skills, sdgs }, extras) => {
      let tagIds: number[] = []
      if (skills && skills.length > 0) {
        tagIds = await getAllTags(skills, extras)
      }
      let results = []
      try {
        const opts = mcpOptions(extras)
        const queryResult = await searchUser(queryTerms, {
          ...opts,
          query: {
            limit: 12,
            organizations: [orgCode],
            skills: tagIds || [],
            sdgs: sdgs || [],
          },
        })
        results = queryResult.results.map((item) => mapUserPreview(item.project))
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
