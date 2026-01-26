import type {
  // GroupModel,
  // GroupOuput,
  PostGroupData,
  AddGroupMembers,
  RemoveGroupMember,
  PostGroupProjects,
  AddParentGroupModelInput,
  GroupMember,
  HierarchyGroupModel,
} from '@/models/group.model'
// import type { HierarchyGroupModel } from '@/models/group.model'
// import type { APIResponseList } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'
import { ProjectModel } from '@/models/project.model'
import { PeopleGroupModel } from '@/models/invitation.model'

// HIERARCHY

export async function getHierarchyGroups(organizationCode: string, config = {}) {
  return await useAPI<PaginationResult<HierarchyGroupModel>>(
    `organization/${organizationCode}/people-groups-hierarchy/`,
    config
  )
}

export async function getPeopleGroupsHierarchy(org_code, params) {
  return await useAPI(`organization/${org_code}/people-groups-hierarchy/`, {
    ..._adaptParamsToGetQuery(params),
  }) //.data.value
}

export async function getGroups(org_id) {
  return await useAPI(`organization/${org_id}/people-group/`, {}) //.data.value
}

// ALL GROUPS

export async function getPeopleGroups(org_code, params) {
  return await useAPI(`organization/${org_code}/people-group/`, {
    ..._adaptParamsToGetQuery(params),
  }) //.data.value
}

export async function postGroup(org: string, groupData: PostGroupData) {
  return await useAPI(`organization/${org}/people-group/`, { body: groupData, method: 'POST' })
  //.data.value
}

// GROUP

export async function addParentGroup(
  orgId: string,
  groupId: number,
  body: AddParentGroupModelInput
) {
  return await useAPI(`organization/${orgId}/people-group/${groupId}/`, { body, method: 'PATCH' }) //.data.value
}

export function getGroup(organizationCode: string, groupId: number, config = {}) {
  return useAPI<PeopleGroupModel>(
    `organization/${organizationCode}/people-group/${groupId}/`,
    config
  )
}

export async function patchGroup(
  organizationCode: string,
  groupName: string,
  groupData: Partial<PostGroupData>
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupName}/`, {
    body: groupData,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteGroup(organizationCode: string, groupName: string) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupName}/`, {
    method: 'DELETE',
  }) //.data.value
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
  }) //.data.value
}

export async function removeGroupMember(
  organizationCode: string,
  groupId: number,
  membersData: RemoveGroupMember
) {
  return await useAPI(`organization/${organizationCode}/people-group/${groupId}/member/remove/`, {
    body: membersData,
    method: 'POST',
  }) //.data.value
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
  }) //.data.value
}

export async function removeGroupProject(
  org: string,
  group_id: number,
  projectsData: PostGroupProjects
) {
  return await useAPI(`organization/${org}/people-group/${group_id}/project/remove/`, {
    body: projectsData,
    method: 'POST',
  }) //.data.value
}

// GROUP HEADER

export async function postGroupHeader(org: string, group_id: number, headerData: FormData) {
  return await useAPI(`organization/${org}/people-group/${group_id}/header/`, {
    body: headerData,
    method: 'POST',
  }) //.data.value
}

export async function patchGroupHeader(org: string, group_id: number, headerData: FormData) {
  return await useAPI(`organization/${org}/people-group/${group_id}/header/`, {
    body: headerData,
    method: 'PATCH',
  }) //.data.value
}

export async function getGroupSimilar(organizationCode: string, groupId: number, config = {}) {
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/similars/`,
    config
  )
}

export async function getSubGroup(organizationCode: string, groupId: number, config = {}) {
  // await delay(2000)
  return await useAPI<PaginationResult<PeopleGroupModel>>(
    `organization/${organizationCode}/people-group/${groupId}/subgroups/`,
    config
  )
}
