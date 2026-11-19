import {
  searchAll,
  searchProjects,
  searchUser,
  getAllTagsById,
} from 'shared-projects-frontend/apis'
import { SORBOBOT_EXTRA, sorbobotIsEnabled } from '~/mcp-server/sorbobot/sorbobot-tool'
import type { McpServer, ServerContext } from '@modelcontextprotocol/server'
import { mapPeopleGroupPreview, mapUserPreview } from './user-tool'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { Config } from 'shared-projects-frontend/apis'
import { mapProjectPreview } from './project-tool'
import { z } from 'zod'

export async function getAllTags(tagsId: number[], ctx: ServerContext): Promise<number[]> {
  const opts = mcpOptions(ctx) as Config
  if (!tagsId?.length) return []
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
      inputSchema: z.object({
        queryTerms: z.string().describe('The search query terms'),
      }),
    },
    resultFromTool(({ queryTerms }, ctx) => {
      const opts = mcpOptions(ctx)
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
      inputSchema: z.object({
        queryTerms: z.string().describe('The search query terms'),
        tags: z.array(z.number()).optional().describe('List of tags to filter by'),
        sdgs: z.array(z.number()).optional().describe('List of SDGs id to filter by'),
        members: z.array(z.string()).optional().describe('List of members id to filter by'),
      }),
    },
    resultFromTool(({ queryTerms, tags, sdgs }, ctx) => {
      return getAllTags(tags, ctx)
        .then((tagsId) => {
          const opts = mcpOptions(ctx)
          return searchProjects(queryTerms, {
            ...opts,
            query: {
              limit: 12,
              organizations: [orgCode],
              tags: tagsId || [],
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
      inputSchema: z.object({
        queryTerms: z.string().describe('The search query terms'),
        skills: z.array(z.number()).optional().describe('List of skills to filter by'),
        sdgs: z.array(z.number()).optional().describe('List of SDGs id to filter by'),
        categories: z.array(z.string()).optional().describe('List of categories to filter by'),
      }),
    },
    resultFromTool(({ queryTerms, skills, sdgs }, ctx) => {
      return getAllTags(skills, ctx)
        .then((tagsId) => {
          const opts = mcpOptions(ctx)
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
