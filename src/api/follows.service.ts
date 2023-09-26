import { axios } from '@/api/api.config'
import {
    AddManyFollowedProject,
    FollowInput,
    FollowOutput,
    FollowOutputList,
} from '@/models/follow.model'
import { APIResponseList } from '@/api/types'

export async function getProjectFollows(body: FollowInput): Promise<APIResponseList<FollowOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/follow/`
        )
    ).data
}

export async function getUserFollows(body: FollowInput): Promise<APIResponseList<FollowOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${body.follower_id}/follow/`
        )
    ).data
}

export async function postFollow(follow: FollowInput): Promise<FollowOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${follow.project_id}/follow/`,
            follow
        )
    ).data
}

export async function postFollowMany({
    id,
    body,
}: {
    id: string
    body: AddManyFollowedProject
}): Promise<FollowOutputList> {
    return await axios.post(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/${id}/follow/follow-many/`,
        body
    )
}

export async function deleteFollow(follow: FollowInput): Promise<void> {
    return (
        await axios.delete(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${follow.project_id}/follow/${
                follow.follower_id
            }/`
        )
    ).data
}
