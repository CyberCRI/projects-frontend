import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'
import { ProjectReviewerModel, ProjectReviewerInput } from '@/models/project-reviewer'

export async function getProjectReviewers(body: {
    project: string
    reviewer: string
}): Promise<APIResponseList<ProjectReviewerModel>> {
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/projectreviewer/?project=${
                body.project
            }&reviewer=${body.reviewer}`
        )
    ).data
}

export async function postProjectReviewer(
    body: ProjectReviewerInput
): Promise<ProjectReviewerModel> {
    return (
        await axios.post(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/projectreviewer/`, body)
    ).data
}

export async function deleteProjectReviewer(id: number): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/projectreviewer/${id}`
    )
}
