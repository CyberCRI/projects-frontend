import { axios } from '@/api/api.config'
import { CommentInputModel, CommentOutput } from '@/models/comment.model'
import { APIResponseList } from '@/api/types'

export async function getComments(project_id: string): Promise<APIResponseList<CommentOutput>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/comment/`
        )
    ).data
}

export async function postComment(comment: CommentInputModel): Promise<CommentOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                comment.project_id
            }/comment/`,
            comment
        )
    ).data
}

export async function getComment(body: CommentInputModel): Promise<CommentOutput> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${body.project_id}/comment/${
                body.comment_id
            }/`
        )
    ).data
}

export async function patchComment(id: number, comment: CommentInputModel): Promise<CommentOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${
                comment.project_id
            }/comment/${id}/`,
            comment
        )
    ).data
}

export async function deleteComment(project_id: string, id: number): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/comment/${id}/`
    )
}

export async function postCommentImage(project_id: string, body: any): Promise<any> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/comment-image/`,
            body
        )
    ).data
}
