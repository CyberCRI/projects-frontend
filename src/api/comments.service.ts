import type { CommentInputModel, CommentOutput } from '@/models/comment.model'
import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getComments(project_id: string) {
    return (await useAPI(`/project/${project_id}/comment/`, {})).data
}

export async function postComment(comment: CommentInputModel) {
    return (
        await useAPI(`/project/${comment.project_id}/comment/`, { body: comment, method: 'POST' })
    ).data
}

export async function getComment(body: CommentInputModel) {
    return (await useAPI(`/project/${body.project_id}/comment/${body.comment_id}/`, {})).data
}

export async function patchComment(id: number, comment: CommentInputModel) {
    return (
        await useAPI(`/project/${comment.project_id}/comment/${id}/`, {
            body: comment,
            method: 'PATCH',
        })
    ).data
}

export async function deleteComment(project_id: string, id: number) {
    return await useAPI(`/project/${project_id}/comment/${id}/`, { method: 'DELETE' })
}

export async function postCommentImage(project_id: string, body: any) {
    return (
        await useAPI(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/comment-image/`,
            { body, method: 'POST' }
        )
    ).data
}
