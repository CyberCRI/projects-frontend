// import type { APIResponseList } from '@/api/types'
import type { /*ReviewModel,*/ ReviewModelInput } from '@/models/review.model'
import useAPI from '@/composables/useAPI'

export async function getReviews(projectId: string) {
  return await useAPI(`project/${projectId}/review/`, {}) //.data.value
}

export async function postReview(review: ReviewModelInput) {
  return await useAPI(`project/${review.project_id}/review/`, { body: review, method: 'POST' })
  //.data.value
}

export async function patchReview(review: ReviewModelInput) {
  return await useAPI(`project/${review.project_id}/review/${review.id}/`, {
    body: review,
    method: 'PATCH',
  }) //.data.value
}

export async function deleteReview({ project_id, id }) {
  return await useAPI(`project/${project_id}/review/${id}/`, { method: 'DELETE' })
}
