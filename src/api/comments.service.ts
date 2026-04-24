import type { CommentInputModel, CommentModel, QueryFilterComments } from '@/models/comment.model'
import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type Config = UseApiOptions<QueryFilterComments>

export async function getComments(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<CommentModel>>(`project/${projectId}/comment/`, config)
}

export async function postComment(
  projectId: ProjectSlugOrId,
  comment: CommentInputModel,
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
  comment: CommentInputModel,
  config: Config = {}
) {
  return await useAPI<CommentModel>(`project/${projectId}/comment/${commentId}/`, {
    ...config,
    body: comment,
    method: 'PATCH',
  })
}

export async function deleteComment(
  projectId: ProjectSlugOrId,
  commentId: CommentModel['id'],
  config: Config = {}
) {
  return await useAPI<void>(`project/${projectId}/comment/${commentId}/`, {
    ...config,
    method: 'DELETE',
  })
}

export async function postCommentImage(projectId: ProjectSlugOrId, body: any) {
  return await useAPI(`project/${projectId}/comment-image/`, { body, method: 'POST' })
}
