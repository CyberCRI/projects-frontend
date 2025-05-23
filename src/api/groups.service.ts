import type {
  // GroupModel,
  // GroupOuput,
  PostGroupData,
  AddGroupMembers,
  RemoveGroupMember,
  PostGroupProjects,
  RemoveGroupProject,
  AddParentGroupModelInput,
} from '@/models/group.model'
// import type { HierarchyGroupModel } from '@/models/group.model'
// import type { APIResponseList } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'

// HIERARCHY

export async function getHierarchyGroups(org: string) {
  return await useAPI(`organization/${org}/people-groups-hierarchy/`, {}) //.data.value
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
  groupId: string,
  body: AddParentGroupModelInput
) {
  return await useAPI(`organization/${orgId}/people-group/${groupId}/`, { body, method: 'PATCH' }) //.data.value
}

export async function getGroup(org: string, groupId: string, noError: boolean = false) {
  return await useAPI(
    `/organization/${org}/people-group/${groupId}/`,
    { noError: noError } // TODO nuxt check error silenced
  ) //.data.value
}

export async function patchGroup(org: string, group_id: number, groupData: Partial<PostGroupData>) {
  return await useAPI(`organization/${org}/people-group/${group_id}/`, {
    body: groupData,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteGroup(org_code, group_id) {
  return await useAPI(`organization/${org_code}/people-group/${group_id}/`, { method: 'DELETE' }) //.data.value
}

// GROUP MEMBERS

export async function getGroupMember(org: string, groupId: string, noError: boolean = false) {
  return (
    // TODO nuxt check error silenced
    await useAPI(`organization/${org}/people-group/${groupId}/member/`, { noError: noError })
    //.data.value
  )
}

export async function postGroupMembers(
  org: string,
  group_id: number,
  membersData: AddGroupMembers
) {
  return await useAPI(`organization/${org}/people-group/${group_id}/member/add/`, {
    body: membersData,
    method: 'POST',
  }) //.data.value
}

export async function removeGroupMember(
  org: string,
  group_id: number,
  membersData: RemoveGroupMember
) {
  return await useAPI(`organization/${org}/people-group/${group_id}/member/remove/`, {
    body: membersData,
    method: 'POST',
  }) //.data.value
}

// GROUP PROJECTS

export async function getGroupProject(org: string, groupId: string, noError: boolean = false) {
  return await useAPI(`organization/${org}/people-group/${groupId}/project/`, {
    noError: noError,
  }) //.data.value
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
  projectsData: RemoveGroupProject
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
