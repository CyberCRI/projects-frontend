import type { QueryFilterReviews, ReviewModel, ReviewModelInput } from '@/models/review.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

type Config = UseApiOptions<QueryFilterReviews>

export async function getReviews(projectId: ProjectSlugOrId, config: Config = {}) {
  return await useAPI<PaginationResult<ReviewModel>>(`project/${projectId}/review/`, config)
}

export async function postReview(review: ReviewModelInput) {
  return await useAPI<ReviewModel>(`project/${review.project_id}/review/`, {
    body: review,
    method: 'POST',
  })
}

export async function patchReview(review: ReviewModelInput) {
  return await useAPI<ReviewModel>(`project/${review.project_id}/review/${review.id}/`, {
    body: review,
    method: 'PATCH',
  })
}

export async function deleteReview({ project_id, id }) {
  return await useAPI<undefined>(`project/${project_id}/review/${id}/`, { method: 'DELETE' })
}
