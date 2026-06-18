import type { QueryFilterReviews, ReviewForm, ReviewId, ReviewModel } from '@/models/review.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

type Config = UseApiOptions<QueryFilterReviews>

export async function getReviews(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ReviewModel>>(`project/${projectId}/review/`, config)
}

export async function postReview(projectId: ProjectSlugOrId, body: ReviewForm) {
  return await useAPI<ReviewModel>(`project/${projectId}/review/`, {
    body,
    method: 'POST',
  })
}

export async function patchReview(
  projectId: ProjectSlugOrId,
  reviewId: ReviewId,
  body: ReviewForm
) {
  return await useAPI<ReviewModel>(`project/${projectId}/review/${reviewId}/`, {
    body,
    method: 'PATCH',
  })
}

export async function deleteReview(projectId: ProjectSlugOrId, reviewId: ReviewId) {
  return await useAPI<undefined>(`project/${projectId}/review/${reviewId}/`, { method: 'DELETE' })
}
