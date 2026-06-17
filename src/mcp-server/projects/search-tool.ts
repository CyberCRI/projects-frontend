import { SORBOBOT_EXTRA, sorbobotIsEnabled } from '../sorbobot/sorbobot-tool'
import { searchAll, searchProjects, searchUser } from '~/api/search.service'
import { mapPeopleGroupPreview, mapUserPreview } from './people-tool'
import { getAllTagsById } from '~/api/tag-classification.service'
import type { Config } from '~/api/tag-classification.service'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/mcp-server/interface'
import { mapProjectPreview } from './project-tool'
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

export default (server: TypeMcpServer) => {
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
    resultFromTool(({ queryTerms }, extras) => {
      const opts = mcpOptions(extras)
      return searchAll(queryTerms, {
        ...opts,
        query: {
          limit: 12,
          organizations: [orgCode],
        },
      }).then((page) =>
        page.results.map((item) => {
          switch (item.type) {
            case 'people_group':
              return mapPeopleGroupPreview(item.people_group)
            case 'user':
              return mapUserPreview(item.user)
            case 'project':
              return mapProjectPreview(item.project)
          }
        })
      )
    })
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
    resultFromTool(({ queryTerms, skills, sdgs }, extras) => {
      return getAllTags(skills, extras)
        .then((tagsId) => {
          const opts = mcpOptions(extras)
          return searchProjects(queryTerms, {
            ...opts,
            query: {
              limit: 12,
              organizations: [orgCode],
              skills: tagsId || [],
              sdgs: sdgs || [],
            },
          })
        })
        .then((page) => page.results.map((item) => mapProjectPreview(item.project)))
    })
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
    resultFromTool(({ queryTerms, skills, sdgs }, extras) => {
      return getAllTags(skills, extras)
        .then((tagsId) => {
          const opts = mcpOptions(extras)
          return searchUser(queryTerms, {
            ...opts,
            query: {
              limit: 12,
              organizations: [orgCode],
              skills: tagsId || [],
              sdgs: sdgs || [],
            },
          })
        })
        .then((page) => page.results.map((item) => mapUserPreview(item.user)))
    })
  )
}
