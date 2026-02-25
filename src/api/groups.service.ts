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
import { PeopleGroupModel, RootPeopleGroupModel } from '@/models/invitation.model'
import { ImageModel } from '@/models/image.model'
import { BaseLocationModel, LocationModel } from '@/models/location.model'

// HIERARCHY
export async function getHierarchyGroups(organizationCode: string, config = {}) {
  return await useAPI<HierarchyGroupModel[]>(
    `organization/${organizationCode}/people-groups-hierarchy/`,
    config
  )
}

export async function getRootGroups(organizationCode: string, config = {}) {
  return await useAPI<RootPeopleGroupModel>(
    `organization/${organizationCode}/root-people-groups/`,
    config
  )
}

export async function getGroups(org_id) {
  return await useAPI(`organization/${org_id}/people-group/`, {})
}

// ALL GROUPS

export async function getPeopleGroups(org_code, params) {
  return await useAPI(`organization/${org_code}/people-group/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function postGroup(org: string, groupData: PostGroupData) {
  return await useAPI(`organization/${org}/people-group/`, { body: groupData, method: 'POST' })
}

// GROUP

export async function addParentGroup(
  orgId: string,
  groupId: number,
  body: AddParentGroupModelInput
) {
  return await useAPI(`organization/${orgId}/people-group/${groupId}/`, { body, method: 'PATCH' })
}

export function getGroup(organizationCode: string, groupId: number, config = {}) {
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

export async function getGroupMember(organizationCode: string, groupId: number, config = {}) {
  return await useAPI<PaginationResult<GroupMember>>(
    `organization/${organizationCode}/people-group/${groupId}/member/`,
    config
  )
}

export async function postGroupMembers(
  organizationCode: string,
  groupId: number,
  membersData: AddGroupMembers
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupId}/member/add/`, {
    body: membersData,
    method: 'POST',
  })
}

export async function removeGroupMember(
  organizationCode: string,
  groupId: number,
  membersData: RemoveGroupMember
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupId}/member/remove/`, {
    body: membersData,
    method: 'POST',
  })
}

// GROUP PROJECTS

export async function getGroupProject(organizationCode: string, groupId: number, config = {}) {
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

export async function getGroupSimilar(organizationCode: string, groupId: number, config = {}) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/similars/`,
    config
  )
}

export async function getSubGroup(organizationCode: string, groupId: number, config = {}) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/subgroups/`,
    config
  )
}

export async function getGroupProjectsLocation(
  organizationCode: string,
  groupId: number,
  config = {}
) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/projects-locations/`,
    config
  )
}

export async function getGroupLocation(organizationCode: string, groupId: number, config = {}) {
  return await useAPI<PaginationResult<LocationModel>>(
    `organization/${organizationCode}/people-group/${groupId}/locations/`,
    config
  )
}

export async function removeGroupLocation(
  organizationCode: string,
  groupId: number,
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
  groupId: number,
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
  groupId: number,
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

export function getGroupGallery(organizationCode: string, groupId: number, config = {}) {
  return useAPI<PaginationResult<ImageModel>>(
    `organization/${organizationCode}/people-group/${groupId}/gallery/`,
    {
      ...config,
    }
  )
}

export function deleteGroupGallery(
  organizationCode: string,
  groupId: number,
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
  groupId: number,
  body: FormData,
  config = {}
) {
  return useAPI<ImageModel>(`organization/${organizationCode}/people-group/${groupId}/gallery/`, {
    ...config,
    body,
    method: 'POST',
  })
}
