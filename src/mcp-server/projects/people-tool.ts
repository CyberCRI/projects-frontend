import { addIfExists, tagMapPreview } from '~/mcp-server/projects/utils'
import type { UserModel, UserSkillModel } from '~/models/user.model'
import type { PeopleGroupModel } from '~/models/invitation.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import { getUser as fetchUser } from '~/api/people.service'
import { /*SDG_OUTPUT_SCHEMA, */ mapSDG } from './sdg-tool'
import type { TypeMcpServer } from '~/interfaces/mcp'
import { getGroup } from '~/api/groups.service'
import N from './zod-schema-utils'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const FETCH_USER_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the user / profile / person / member, use the search tool with the user / profile / person / member  firstname and lastname, the user / profile / person / member id or slug will be in the first result, else use the previously mentioned slug or id.'

export const FETCH_GROUP_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the group of users, use the search tool with the group of user name, the group id or slug will be in the first result, else use the previously mentioned slug or id.'

export const USER_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the user'),
  slug: N.string().describe('The slug of the user'),
  item_type: N.literal('user').describe('The type of the item, always user'),
  given_name: N.string().describe('The given name of the user'),
  family_name: N.string().describe('The family name of the user'),
  job: N.string().describe('The job or title of the user'),
  email: N.string().describe('The email of the user'),
  link_url: N.string().describe('The URL link to the user profile'),
  item_image: N.string().describe('The image URL of the user profile'),
})

const mapUserSkill = (skill: UserSkillModel) => ({
  item_type: 'user_skill',
  ...pick(skill, [
    'id',
    'level',
    'level_to_reach',
    'type',
    'can_mentor',
    'needs_mentor',
    'comment',
  ]),
  tag: tagMapPreview(skill.tag),
})

// people_groups: (user.people_groups || []).map(mapPeopleGroupPreview),
export const mapUserPreview = (user: UserModel) => ({
  item_type: 'user',
  link_url: `/profile/${user.slug}/`,
  ...pick(user, [
    'id',
    'slug',
    'given_name',
    'family_name',
    'job',
    'email',
    // this can be not exists, but add if exists
    'is_superuser',
    'short_description',
    'description',
    'facebook',
    'linkedin',
    'website',
  ]),
  item_image: user.profile_picture?.variations?.small,

  // this can be not set, add it and convert it only if exists
  ...addIfExists('skills', user, (skills: UserModel['skills']) => skills.map(mapUserSkill)),
  ...addIfExists('sdgs', user, (sdgs: UserModel['sdgs']) => sdgs.map(mapSDG)),
  ...addIfExists('people_groups', user, (groups: UserModel['people_groups']) =>
    groups.map(mapPeopleGroupPreview)
  ),
})

export const PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the people group'),
  slug: N.string().describe('The slug of the people group'),
  item_type: N.literal('people_group').describe('The type of the item, always people_group'),
  name: N.string().describe('The name of the people group'),
  short_description: N.string().describe('The short description of the people group'),
  description: N.string().describe('The description of the people group'),
  email: N.string().describe('The email of the people group'),
  member_count: N.number().describe('The number of members in the people group'),
  link_url: N.string().describe('The URL link to the people group'),
  item_image: N.string().describe('The image URL of the people group'),
})

export const mapPeopleGroupPreview = (group: PeopleGroupModel) => ({
  item_type: 'people_group',
  link_url: `/group/${group.slug}/`,
  ...pick(group, ['id', 'slug', 'name', 'short_description', 'description', 'email']),
  item_image: group.header_image?.variations?.small,
  member_count: group.modules?.members || 0,
  ...addIfExists('children', group, (data: PeopleGroupModel['children']) =>
    data.map(mapPeopleGroupPreview)
  ),
  ...addIfExists('hierarchy', group, (data: PeopleGroupModel['hierarchy']) =>
    data.map(mapPeopleGroupPreview)
  ),
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'people-general-data',
    {
      title: 'People general data',
      description: `Get main general data (job or title, biography, skills, hobbies, and projects) about a person / people / profile / user / member given its id or slug. ${FETCH_USER_SLUG_OR_ID}`,
      inputSchema: {
        idOrSlug: z.string().describe('The id or slug of the user / profile / person / member'),
      },
      /*outputSchema: {
        user_data: USER_PREVIEW_OUTPUT_SCHEMA.extend({
          is_superuser: N.boolean().describe('Whether the user is a superuser'),
          people_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
            'The list of people groups the user belongs to'
          ),
          skills: N.array(
            N.object({
              id: N.number().describe('The ID of the skill'),
              tag: N.object({
                id: N.number().describe('The ID of the tag'),
                title: N.string().describe('The title of the tag'),
                description: N.string().describe('The description of the tag'),
              }),
              level: N.number().describe('The level of the skill'),
              level_to_reach: N.number().describe('The level to reach of the skill'),
              type: N.string().describe('The type of the skill'),
              can_mentor: N.boolean().describe('Whether the user can mentor this skill'),
              needs_mentor: N.boolean().describe('Whether the user needs a mentor for this skill'),
              comment: N.string().describe('The comment of the skill'),
            })
          ).describe('The list of skills of the user'),
          short_description: N.string().describe('The short description of the user'),
          description: N.string().describe('The description of the user'),
          location: N.string().describe('The location of the user'),
          facebook: N.string().describe('The Facebook profile URL of the user'),
          linkedin: N.string().describe('The LinkedIn profile URL of the user'),
          website: N.string().describe('The website URL of the user'),
          sdgs: N.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the user'),
        }),
      },*/
    },
    resultFromTool(({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)
      return fetchUser(idOrSlug, opts).then(mapUserPreview)
    })
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
    resultFromTool(({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)
      return getGroup(orgCode, idOrSlug, opts).then((group) => mapPeopleGroupPreview(group))
    })
  )
}
