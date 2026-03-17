import type {
  PostGroupData,
  AddGroupMembers,
  RemoveGroupMember,
  PostGroupProjects,
  AddParentGroupModelInput,
  GroupMember,
  HierarchyGroupModel,
} from '@/models/group.model'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'
import { ProjectModel } from '@/models/project.model'
import { PeopleGroupIdOrSlug, PeopleGroupModel } from '@/models/invitation.model'
import { ImageModel } from '@/models/image.model'
import { BaseLocationModel, LocationModel } from '@/models/location.model'

// HIERARCHY
export async function getHierarchyGroups(organizationCode: string, config = {}) {
  return await useAPI<PaginationResult<HierarchyGroupModel>>(
    `organization/${organizationCode}/people-groups-hierarchy/`,
    config
  )
}

// ALL GROUPS
export async function getPeopleGroups(organizationCode, config) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/`,
    {
      ..._adaptParamsToGetQuery(config),
    }
  )
}

export async function postGroup(organizationCode: string, groupData: PostGroupData) {
  return await useAPI(`organization/${organizationCode}/people-group/`, {
    body: groupData,
    method: 'POST',
  })
}

// GROUP
export async function addParentGroup(
  orgId: string,
  groupId: PeopleGroupIdOrSlug,
  body: AddParentGroupModelInput
) {
  return await useAPI(`organization/${orgId}/people-group/${groupId}/`, { body, method: 'PATCH' })
}

export function getGroup(organizationCode: string, groupId: PeopleGroupIdOrSlug, config = {}) {
  return useAPI<PeopleGroupModel>(
    `organization/${organizationCode}/people-group/${groupId}/`,
    config
  )
}

export async function patchGroup(
  organizationCode: string,
  groupName: number,
  groupData: Partial<PostGroupData>
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupName}/`, {
    body: groupData,
    method: 'PATCH',
  })
}

export async function deleteGroup(organizationCode: string, groupName: string) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupName}/`, {
    method: 'DELETE',
  })
}

// GROUP MEMBERS

export async function getGroupMember(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<GroupMember>>(
    `organization/${organizationCode}/people-group/${groupId}/member/`,
    config
  )
}

export async function postGroupMembers(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  membersData: AddGroupMembers
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupId}/member/add/`, {
    body: membersData,
    method: 'POST',
  })
}

export async function removeGroupMember(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  membersData: RemoveGroupMember
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupId}/member/remove/`, {
    body: membersData,
    method: 'POST',
  })
}

// GROUP PROJECTS

export async function getGroupProject(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<ProjectModel>>(
    `organization/${organizationCode}/people-group/${groupId}/project/`,
    config
  )
}

export async function postGroupProjects(
  org: string,
  group_id: number,
  projectsData: PostGroupProjects
) {
  return await useAPI(`organization/${org}/people-group/${group_id}/project/add/`, {
    body: projectsData,
    method: 'POST',
  })
}

export async function removeGroupProject(
  org: string,
  group_id: number,
  projectsData: PostGroupProjects
) {
  return await useAPI(`organization/${org}/people-group/${group_id}/project/remove/`, {
    body: projectsData,
    method: 'POST',
  })
}

// GROUP HEADER

export async function postGroupHeader(org: string, group_id: number, headerData: FormData) {
  return await useAPI(`organization/${org}/people-group/${group_id}/header/`, {
    body: headerData,
    method: 'POST',
  })
}

export async function patchGroupHeader(org: string, group_id: number, headerData: FormData) {
  return await useAPI(`organization/${org}/people-group/${group_id}/header/`, {
    body: headerData,
    method: 'PATCH',
  })
}

export async function getGroupSimilar(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/similars/`,
    config
  )
}

export async function getSubGroup(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/subgroups/`,
    config
  )
}

export async function getGroupProjectsLocation(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/projects-locations/`,
    config
  )
}

export async function getGroupLocation(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/locations/`,
    config
  )
}

export async function removeGroupLocation(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  locationId: number,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/locations/${locationId}/`,
    {
      ...config,
      method: 'DELETE',
    }
  )
}

export async function patchGroupLocation(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  locationId: number,
  payload: Partial<BaseLocationModel>,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/locations/${locationId}/`,
    {
      ...config,
      body: payload,
      method: 'PATCH',
    }
  )
}

export async function postGroupLocation(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  payload: BaseLocationModel,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/locations/`,
    {
      ...config,
      body: payload,
      method: 'POST',
    }
  )
}

export function getGroupGallery(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  config = {}
) {
  return useAPI<PaginationResult<ImageModel>>(
    `organization/${organizationCode}/people-group/${groupId}/gallery/`,
    {
      ...config,
    }
  )
}

export function deleteGroupGallery(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  imageId: number,
  config = {}
) {
  return useAPI<ImageModel>(
    `organization/${organizationCode}/people-group/${groupId}/gallery/${imageId}/`,
    {
      ...config,
      method: 'DELETE',
    }
  )
}

export function postGroupGallery(
  organizationCode: string,
  groupId: PeopleGroupIdOrSlug,
  body: FormData,
  config = {}
) {
  return useAPI<ImageModel>(`organization/${organizationCode}/people-group/${groupId}/gallery/`, {
    ...config,
    body,
    method: 'POST',
  })
}
