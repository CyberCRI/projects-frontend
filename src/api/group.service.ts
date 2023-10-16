import { axios } from '@/api/api.config'
import {
    GroupModel,
    PostGroupData,
    AddGroupMembers,
    RemoveGroupMember,
    PostGroupProjects,
    RemoveGroupProject,
} from '@/models/group.model'
import { HierarchyGroupModel } from '@/models/group.model'
import { APIResponseList } from '@/api/types'

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

export async function getGroup(org: string, groupId: string): Promise<GroupModel> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/`
        )
    ).data
}

export async function getGroupMember(org: string, groupId: string): Promise<GroupModel> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/member/`
        )
    ).data
}

export async function getGroupProject(org: string, groupId: string): Promise<GroupModel> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${org}/people-group/${groupId}/project/`
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
