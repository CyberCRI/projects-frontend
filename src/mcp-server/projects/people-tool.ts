import { addIfExists, tagMapPreview } from '~/mcp-server/projects/utils'
import type { UserModel, UserSkillModel } from '~/models/user.model'
import type { PeopleGroupModel } from '~/models/invitation.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import { getUser as fetchUser } from '~/api/people.service'
import type { TypeMcpServer } from '~/interfaces/mcp'
import { getGroup } from '~/api/groups.service'
import { mapSDG } from './sdg-tool'
import N from './zod-schema-utils'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const FETCH_USER_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the user / profile / person / member, use the search tool with the user / profile / person / member  firstname and lastname, the user / profile / person / member id or slug will be in the first result, else use the previously mentioned slug or id.'

export const FETCH_GROUP_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the group of users, use the search tool with the group of user name, the group id or slug will be in the first result, else use the previously mentioned slug or id.'

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
  short_description: N.string().nullable().describe('The short description of the people group'),
  description: N.string().nullable().describe('The description of the people group'),
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
        people_group_data: PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
      },
    },
    resultFromTool(async ({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)
      return getGroup(orgCode, idOrSlug, opts).then((group) => ({
        people_group_data: mapPeopleGroupPreview(group),
      }))
    })
  )
}
