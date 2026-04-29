import type { ReviewModelInput } from '~/models/review.model'

import useAPI from '~/composables/useAPI'

export async function getReviews(projectId: string) {
  return await useAPI(`project/${projectId}/review/`, {})
}

export async function postReview(review: ReviewModelInput) {
  return await useAPI(`project/${review.project_id}/review/`, { body: review, method: 'POST' })
}

export async function patchReview(review: ReviewModelInput) {
  return await useAPI(`project/${review.project_id}/review/${review.id}/`, {
    body: review,
    method: 'PATCH',
  })
}

export async function deleteReview({ project_id, id }) {
  return await useAPI(`project/${project_id}/review/${id}/`, { method: 'DELETE' })
}
