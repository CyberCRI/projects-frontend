import type {
    AddManyFollowedProject,
    FollowInput,
    FollowOutput,
    FollowOutputList,
} from '@/models/follow.model'
import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getProjectFollows(body: FollowInput) {
    return (await useAPI(`project/${body.project_id}/follow/`, {})).data.value
}

export async function getUserFollows(body: FollowInput, params) {
    return (await useAPI(`user/${body.follower_id}/follow/`, { params })).data.value
}

export async function postFollow(follow: FollowInput) {
    return (await useAPI(`project/${follow.project_id}/follow/`, { body: follow, method: 'POST' }))
        .data.value
}

export async function postFollowMany({ id, body }: { id: string; body: AddManyFollowedProject }) {
    return await useAPI(`user/${id}/follow/follow-many/`, { body, method: 'POST' })
}

export async function deleteFollow(follow: FollowInput) {
    return (
        await useAPI(`project/${follow.project_id}/follow/${follow.follower_id}/`, {
            method: 'DELETE',
        })
    ).data.value
}
