import { axios } from './api.config'
import { APIResponseList } from '@/api/types'
import { ReviewModel, ReviewModelInput } from '@/models/review.model'

export async function getReviews(projectId: string): Promise<APIResponseList<ReviewModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${projectId}/review/`
        )
    ).data
}

export async function postReview(review: ReviewModelInput): Promise<ReviewModel> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${review.project_id}/review/`,
            review
        )
    ).data
}

export async function patchReview(review: ReviewModelInput): Promise<ReviewModel> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${review.project_id}/review/${
                review.id
            }/`,
            review
        )
    ).data
}

export async function deleteReview({ project_id, id }): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/review/${id}/`
    )
}
