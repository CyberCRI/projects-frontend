import { axios, axiosNoErrorMessage } from '@/api/api.config'
import {
    GroupModel,
    GroupOuput,
    PostGroupData,
    AddGroupMembers,
    RemoveGroupMember,
    PostGroupProjects,
    RemoveGroupProject,
    AddParentGroupModelInput,
} from '@/models/group.model'
import { HierarchyGroupModel } from '@/models/group.model'
import { APIResponseList } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'

// HIERARCHY

export async function getHierarchyGroups(
    org: string
): Promise<APIResponseList<HierarchyGroupModel>> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-groups-hierarchy/`
        )
    ).data
}

export async function getPeopleGroupsHierarchy(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-groups-hierarchy/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function getGroups(org_id): Promise<APIResponseList<GroupModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org_id}/people-group/`
        )
    ).data
}

// ALL GROUPS

export async function getPeopleGroups(org_code, params) {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function postGroup(org: string, groupData: PostGroupData): Promise<GroupModel> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org}/people-group/`,
            groupData
        )
    ).data
}

// GROUP

export async function addParentGroup(
    orgId: string,
    groupId: string,
    body: AddParentGroupModelInput
): Promise<GroupOuput> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${orgId}/people-group/${groupId}/`,
            body
        )
    ).data
}

export async function getGroup(
    org: string,
    groupId: string,
    noError: boolean = false
): Promise<GroupOuput> {
    const _axios = noError ? axiosNoErrorMessage : axios
    return (
        await _axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/`
        )
    ).data
}

export async function patchGroup(
    org: string,
    group_id: number,
    groupData: Partial<PostGroupData>
): Promise<GroupModel> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/`,
            groupData
        )
    ).data
}

export async function deleteGroup(org_code, group_id): Promise<APIResponseList<GroupModel>> {
    return (
        await axios.delete(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org_code}/people-group/${group_id}/`
        )
    ).data
}

// GROUP MEMBERS

export async function getGroupMember(
    org: string,
    groupId: string,
    noError: boolean = false
): Promise<GroupModel> {
    const _axios = noError ? axiosNoErrorMessage : axios
    return (
        await _axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/member/`
        )
    ).data
}

export async function postGroupMembers(
    org: string,
    group_id: number,
    membersData: AddGroupMembers
): Promise<GroupModel> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/member/add/`,
            membersData
        )
    ).data
}

export async function removeGroupMember(
    org: string,
    group_id: number,
    membersData: RemoveGroupMember
): Promise<GroupModel> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/member/remove/`,
            membersData
        )
    ).data
}

// GROUP PROJECTS

export async function getGroupProject(
    org: string,
    groupId: string,
    noError: boolean = false
): Promise<GroupModel> {
    const _axios = noError ? axiosNoErrorMessage : axios
    return (
        await _axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/project/`
        )
    ).data
}

export async function postGroupProjects(
    org: string,
    group_id: number,
    projectsData: PostGroupProjects
): Promise<GroupModel> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/project/add/`,
            projectsData
        )
    ).data
}

export async function removeGroupProject(
    org: string,
    group_id: number,
    projectsData: RemoveGroupProject
): Promise<GroupModel> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/project/remove/`,
            projectsData
        )
    ).data
}

// GROUP HEADER

export async function postGroupHeader(
    org: string,
    group_id: number,
    headerData: FormData
): Promise<GroupModel> {
    return (
        await axios.post(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/header/`,
            headerData
        )
    ).data
}

export async function patchGroupHeader(
    org: string,
    group_id: number,
    headerData: FormData
): Promise<GroupModel> {
    return (
        await axios.patch(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${group_id}/header/`,
            headerData
        )
    ).data
}
