import { axios } from '@/api/api.config'
import { GroupModel, GroupOuput, AddParentGroupModelInput } from '@/models/group.model'
import { APIResponseList } from '@/api/types'

export async function getGroups(org_id): Promise<APIResponseList<GroupModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/organization/${org_id}/people-group/`
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
