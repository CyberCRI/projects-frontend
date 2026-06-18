import type { CommentModel, QueryFilterComments } from '@/models/comment.model'
import type { ProjectMessageForm } from '~/models/project-message.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

type Config = UseApiOptions<QueryFilterComments>

export async function getComments(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<CommentModel>>(`project/${projectId}/comment/`, config)
}

export async function postComment(
  projectId: ProjectSlugOrId,
  comment: ProjectMessageForm,
  config: Config = {}
) {
  return await useAPI<CommentModel>(`project/${projectId}/comment/`, {
    ...config,
    body: comment,
    method: 'POST',
  })
}

export async function getComment(
  projectId: ProjectSlugOrId,
  commentId: CommentModel['id'],
  config: Config = {}
) {
  return await useAPI<CommentModel>(`project/${projectId}/comment/${commentId}/`, config)
}

export async function patchComment(
  projectId: ProjectSlugOrId,
  commentId: CommentModel['id'],
  body: ProjectMessageForm
) {
  return await useAPI<CommentModel>(`project/${projectId}/comment/${commentId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteComment(
  projectId: ProjectSlugOrId,
  commentId: CommentModel['id'],
  config: Config = {}
) {
  return await useAPI<undefined>(`project/${projectId}/comment/${commentId}/`, {
    ...config,
    method: 'DELETE',
  })
}

export async function postCommentImage(projectId: ProjectSlugOrId, body: any) {
  return await useAPI(`project/${projectId}/comment-image/`, { body, method: 'POST' })
}
