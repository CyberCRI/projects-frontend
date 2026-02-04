import { z } from 'zod'
import N from './zod-schema-utils'
import { mcpFetch, API_BASE_URL } from './base'
import {
  USER_PREVIEW_OUTPUT_SCHEMA,
  mapUserPreview,
  PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
  mapPeopleGroupPreview,
} from './people-tool'
import { SDG_OUTPUT_SCHEMA, mapSDG } from './sdg-tool'
import { tagMapper } from './tag-schema'

export const CATEGORY_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the category'),
  slug: N.string().describe('The slug of the category'),
  name: N.string().describe('The name of the category'),
  item_type: N.literal('category').describe('The type of the item, always category'),
  link_url: N.string().describe('The URL link to the category'),
})

export const categoryMapper = (c: any) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  link_url: `/categories/${c.slug}/`,
  item_type: 'category',
})

export const PROJECT_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.string().describe('The ID of the project'),
  slug: N.string().describe('The slug of the project'),
  item_type: N.literal('project').describe('The type of the item, always project'),
  title: N.string().describe('The title of the project'),
  purpose: N.string().describe('The purpose of the project'),
  categories: N.array(CATEGORY_PREVIEW_OUTPUT_SCHEMA).describe(
    'The list of categories of the project'
  ),
  link_url: N.string().describe('The URL link to the project'),
  item_image: N.string().nullable().describe('The image URL of the project'),
})

export const mapProjectPreview = (p: any) => ({
  id: p.id,
  slug: p.slug,
  item_type: 'project',
  title: p.title,
  purpose: p.purpose,
  categories: (p.categories || []).map(categoryMapper),
  link_url: `/projects/${p.slug}/`,
  item_image: p.header_image?.variations?.small,
})

const BLOG_ENTRY_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the blog entry'),
  title: N.string().describe('The title of the blog entry'),
  content: N.string().describe('The content of the blog entry'),
})

export const FETCH_PROJECT_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the project, use the search tool with the project name, the project id or slug will be in the first result, else use the previously mentioned slug or id.'

export const mapBlogEntry = (b: any) => ({
  id: b.id,
  title: b.title,
  content: b.content,
})

export default (server) => {
  // Add an search tool
  server.registerTool(
    'project-general-data',
    {
      title: 'Project general data',
      description: `Get main general data (description, goals, blog entries, members...) about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      outputSchema: {
        project_data: PROJECT_PREVIEW_OUTPUT_SCHEMA.extend({
          purpose: N.string().describe('The purpose of the project'),
          description: N.string().nullable().describe('The description of the project'),
          sdgs: N.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the project'),
          tags: N.array(
            N.object({ id: N.number(), title: N.string(), description: N.string() })
          ).describe('The list of tags of the project'),
          goals: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the goal'),
              description: N.string().describe('The description of the goal'),
              status: N.string().describe('The status of the goal'),
            })
          ).describe('The list of goals of the project'),
          reviews: N.array(
            N.object({
              title: N.string().describe('The title of the review'),
              description: N.string().describe('The description of the review'),
              reviewer: USER_PREVIEW_OUTPUT_SCHEMA.nullable().describe(
                'The reviewer of the review'
              ),
            })
          ).describe('The list of reviews of the project'),
          locations: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the location'),
              description: N.string().describe('The description of the location'),
              type: N.string().describe('The type of the location'),
              lat: N.number().describe('The latitude of the location'),
              lng: N.number().describe('The longitude of the location'),
            })
          ).describe('The list of locations of the project'),
          announcements: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the announcement'),
              description: N.string().describe('The description of the announcement'),
              status: N.string().describe('The status of the announcement'),
              deadline: z.string().nullable().describe('The deadline of the announcement'),
              is_remunerated: z.boolean().describe('Whether the announcement is remunerated'),
            })
          ).describe('The list of announcements of the project'),
          links: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the link'),
              category: N.string(),
              description: N.string().describe('The description of the link'),
              site_name: N.string(),
              site_url: N.string(),
            })
          ).describe('The list of links of the project'),
          files: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the file'),
              description: N.string().describe('The description of the file'),
              file: N.string(),
              mime: N.string(),
            })
          ).describe('The list of files of the project'),
          blog_entries: N.array(BLOG_ENTRY_OUTPUT_SCHEMA).describe(
            'The list of blog entries of the project'
          ),
          linked_projects: N.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe(
            'The list of linked projects of the project'
          ),
          views: N.number().describe('The number of views of the project'),
          team: N.object({
            members: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team members of the project'
            ),
            owners: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team owners of the project'
            ),
            reviewers: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team reviewers of the project'
            ),
            member_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team member groups of the project'
            ),
            owner_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team owner groups of the project'
            ),
            reviewer_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team reviewer groups of the project'
            ),
          }),
        }),
      },
    },
    async ({ idOrSlug }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}project/${idOrSlug}/`,
          {},
          extras
        )
        const p = queryResult
        results = {
          item_type: 'project',
          link_url: `/projects/${p.slug}/`,
          id: p.id,
          item_image: p.header_image?.variations?.small,
          slug: p.slug,
          title: p.title,
          description: p.description,
          sdgs: (p.sdgs || []).map(mapSDG),
          purpose: p.purpose,
          tags: (p.tags || []).map(tagMapper),
          categories: (p.categories || []).map(categoryMapper),
          goals: (p.goals || []).map((g: any) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            status: g.status,
          })),
          reviews: (p.reviews || []).map((r: any) => ({
            r: r.id,
            title: r.title,
            description: r.description,
            reviewer: r.reviewer ? mapUserPreview(r.reviewer) : null,
          })),
          locations: (p.locations || []).map((l: any) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            type: l.type,
            lat: l.lat,
            lng: l.lng,
          })),
          announcements: (p.announcements || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            status: a.status,
            deadline: a.deadline,
            is_remunerated: a.is_remunerated,
          })),
          links: (p.links || []).map((link: any) => ({
            id: link.id,
            title: link.title,
            category: link.category,
            description: link.description,
            site_name: link.site_name,
            site_url: link.site_url,
          })),
          files: (p.files || []).map((file: any) => ({
            id: file.id,
            title: file.title,
            description: file.description,
            file: file.file,
            mime: file.mime,
          })),
          blog_entries: (p.blog_entries || []).map(mapBlogEntry),
          linked_projects: (p.linked_projects || []).map(mapProjectPreview),
          views: p.views,
          team: {
            members: (p.team?.members || []).map(mapUserPreview),
            owners: (p.team?.owners || []).map(mapUserPreview),
            reviewers: (p.team?.reviewers || []).map(mapUserPreview),
            member_groups: (p.team?.member_groups || []).map(mapPeopleGroupPreview),
            owner_groups: (p.team?.owner_groups || []).map(mapPeopleGroupPreview),
            reviewer_groups: (p.team?.reviewer_groups || []).map(mapPeopleGroupPreview),
          },
        }
      } catch (error) {
        console.error('Error fetching project general data:', error)
      }
      const output = { project_data: results }
      // console.log('MCP TOOL CALLED: project-general-data', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'project-similar',
    {
      title: 'Project similar projects',
      description: `Get projects that are similar to the one given by its id or slug.   ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of similar projects'),
      },
    },
    async ({ idOrSlug }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}project/${idOrSlug}/similar/`,
          {},
          extras
        )
        results = queryResult.results.map((p: any) => mapProjectPreview(p))
      } catch (error) {
        console.error('Error fetching project similar projects:', error)
      }
      const output = { results }
      console.log('MCP TOOL CALLED: project-similar-projects', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'project-blog-entries',
    {
      title: 'Project blog entries',
      description: `Get main blog entries about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      outputSchema: {
        results: N.array(BLOG_ENTRY_OUTPUT_SCHEMA).describe('The list of blog entries'),
      },
    },
    async ({ idOrSlug }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}project/${idOrSlug}/blog-entry/`,
          {},
          extras
        )
        results = queryResult.results.map(mapBlogEntry)
      } catch (error) {
        console.error('Error fetching project blog entries:', error)
      }
      const output = { results }
      console.log('MCP TOOL CALLED: project-blog-entries', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'project-blog-entry',
    {
      title: 'Project blog entries',
      description: `Get main blog entries about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: {
        idOrSlug: z.string().describe('The id or slug of the project'),
        blogEntryId: z.string().describe('The id of the blog entry'),
      },
      outputSchema: { blog_entry: BLOG_ENTRY_OUTPUT_SCHEMA },
    },
    async ({ idOrSlug, blogEntryId }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}project/${idOrSlug}/blog-entry/${blogEntryId}/`,
          {},
          extras
        )
        results = mapBlogEntry(queryResult)
      } catch (error) {
        console.error('Error fetching project blog entry:', error)
      }
      const output = { blog_entry: results }
      // console.log('MCP TOOL CALLED: project-blog-entry', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
