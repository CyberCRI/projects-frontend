import { z } from 'zod'
import { mcpFetch, API_BASE_URL, orgCode } from './base'
import { SDG_OUTPUT_SCHEMA, mapSDG } from './sdg-tool'
import { tagMapper } from './tag-schema'

export const FETCH_USER_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the user / profile / person / member, use the search tool with the user / profile / person / member  firstname and lastname, the user / profile / person / member id or slug will be in the first result, else use the previously mentioned slug or id.'

export const FETCH_GROUP_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the group of users, use the search tool with the group of user name, the group id or slug will be in the first result, else use the previously mentioned slug or id.'

export const USER_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.number().optional().nullable().describe('The ID of the user'),
  slug: z.string().optional().nullable().describe('The slug of the user'),
  item_type: z.literal('user').describe('The type of the item, always user'),
  given_name: z.string().optional().nullable().describe('The given name of the user'),
  family_name: z.string().optional().nullable().describe('The family name of the user'),
  job: z.string().optional().nullable().nullable().describe('The job or title of the user'),
  email: z.string().optional().nullable().describe('The email of the user'),
  link_url: z.string().optional().nullable().describe('The URL link to the user profile'),
  item_image: z.string().optional().nullable().describe('The image URL of the user profile'),
})

export const mapUserPreview = (u: any) => ({
  id: u.id,
  slug: u.slug,
  item_type: 'user',
  given_name: u.given_name,
  family_name: u.family_name,
  job: u.job,
  email: u.email,
  link_url: `/profile/${u.slug}/`,
  item_image: u.profile_picture?.variations?.small,
})

export const PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.number().optional().nullable().describe('The ID of the people group'),
  slug: z.string().optional().nullable().describe('The slug of the people group'),
  item_type: z.literal('people_group').describe('The type of the item, always people_group'),
  name: z.string().describe('The name of the people group'),
  short_description: z
    .string()
    .optional()
    .nullable()
    .describe('The short description of the people group'),
  description: z.string().optional().nullable().describe('The description of the people group'),
  email: z.string().optional().nullable().describe('The email of the people group'),
  member_count: z
    .number()
    .optional()
    .nullable()
    .describe('The number of members in the people group'),
  link_url: z.string().optional().nullable().describe('The URL link to the people group'),
  item_image: z.string().optional().nullable().describe('The image URL of the people group'),
})

export const mapPeopleGroupPreview = (g: any) => ({
  id: g.id,
  slug: g.slug,
  item_type: 'people_group',
  name: g.name,
  short_description: g.short_description,
  description: g.description,
  email: g.email,
  member_count: g.member_count,
  link_url: `/group/${g.slug}/`,
  item_image: g.header_image?.variations?.small,
})

export default (server) => {
  // Add an search tool
  server.registerTool(
    'people-general-data',
    {
      title: 'People general data',
      description: `Get main general data (job or title, biography, skills, hobbies, and projects) about a person / people / profile / user / member given its id or slug. ${FETCH_USER_SLUG_OR_ID}`,
      inputSchema: {
        idOrSlug: z.string().describe('The id or slug of the user / profile / person / member'),
      },
      outputSchema: {
        user_data: USER_PREVIEW_OUTPUT_SCHEMA.extend({
          is_superuser: z.boolean().describe('Whether the user is a superuser'),
          people_groups: z
            .array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA)
            .optional()
            .nullable()
            .describe('The list of people groups the user belongs to'),
          skills: z
            .array(
              z.object({
                id: z.number().describe('The ID of the skill'),
                tag: z.object({
                  id: z.number().optional().nullable().describe('The ID of the tag'),
                  title: z.string().optional().nullable().describe('The title of the tag'),
                  description: z
                    .string()
                    .optional()
                    .nullable()
                    .describe('The description of the tag'),
                }),
                level: z.number().optional().nullable().describe('The level of the skill'),
                level_to_reach: z
                  .number()
                  .optional()
                  .nullable()
                  .describe('The level to reach of the skill'),
                type: z.string().optional().nullable().describe('The type of the skill'),
                can_mentor: z.boolean().describe('Whether the user can mentor this skill'),
                needs_mentor: z
                  .boolean()
                  .optional()
                  .nullable()
                  .describe('Whether the user needs a mentor for this skill'),
                comment: z.string().optional().nullable().describe('The comment of the skill'),
              })
            )
            .describe('The list of skills of the user'),
          short_description: z
            .string()
            .optional()
            .nullable()
            .describe('The short description of the user'),
          description: z.string().optional().nullable().describe('The description of the user'),
          location: z.string().optional().nullable().describe('The location of the user'),
          facebook: z
            .string()
            .optional()
            .nullable()
            .describe('The Facebook profile URL of the user'),
          linkedin: z
            .string()
            .optional()
            .nullable()
            .describe('The LinkedIn profile URL of the user'),
          website: z.string().optional().nullable().describe('The website URL of the user'),
          sdgs: z.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the user'),
        }),
      },
    },
    async ({ idOrSlug }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}user/${idOrSlug}/`,
          {},
          extras
        )
        const u = queryResult
        results = {
          id: u.id,
          item_type: 'user',
          link_url: `/profile/${u.slug}/`,
          item_image: u.profile_picture?.variations?.small,
          slug: u.slug,
          is_superuser: u.is_superuser,
          people_groups: (u.people_groups || []).map(mapPeopleGroupPreview),
          skills: (u.skills || []).map((s) => ({
            id: s.id,
            tag: tagMapper(s.tag),
            level: s.level,
            level_to_reach: s.level_to_reach,
            type: s.type,
            can_mentor: s.can_mentor,
            needs_mentor: s.needs_mentor,
            comment: s.comment,
          })),
          given_name: u.given_name,
          family_name: u.family_name,
          short_description: u.short_description,
          description: u.description,
          location: u.location,
          job: u.job,
          email: u.email,
          facebook: u.facebook,
          linkedin: u.linkedin,
          website: u.website,
          sdgs: (u.sdgs || []).map(mapSDG),
        }
      } catch (error) {
        console.error('Error fetching profile general data:', error)
      }
      const output = { user_data: results }
      // console.log('MCP TOOL CALLED: profile-general-data', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'people-group-data',
    {
      title: 'People group data',
      description: `Get main general data about a people group (or member group, or user group) given its id or slug. ${FETCH_GROUP_SLUG_OR_ID}.`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the people group') },
      outputSchema: {
        people_group_data: PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA.extend({
          description: z.string().nullable().describe('The description of the people group'),
          short_description: z
            .string()
            .nullable()
            .describe('The short description of the people group'),
        }),
      },
    },
    async ({ idOrSlug }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/people-group/${idOrSlug}/`,
          {},
          extras
        )
        const g = queryResult
        results = {
          id: g.id,
          item_type: 'people_group',
          item_image: g.header_image?.variations?.small,
          slug: g.slug,
          name: g.name,
          description: g.description,
          short_description: g.short_description,
          email: g.email,
          hierarchy: (g.hierarchy || []).map(mapPeopleGroupPreview),
          children: (g.children || []).map(mapPeopleGroupPreview),
        }
      } catch (error) {
        console.error('Error fetching group general data:', error)
      }
      const output = { people_group_data: results }
      // console.log('MCP TOOL CALLED: people-group-data', { idOrSlug, output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
