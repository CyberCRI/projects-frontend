import { axios } from '@/api/api.config'
import { GoalInput, GoalOutput } from '@/models/goal.model'
import { APIResponseList } from '@/api/types'

export async function getAllGoals(id): Promise<APIResponseList<GoalOutput>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/goal/`))
        .data
}

export async function createGoal({
    goal,
    project_id,
}: {
    goal: GoalInput
    project_id: string
}): Promise<GoalOutput> {
    return (
        await axios.post(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/goal/ `,
            goal
        )
    ).data
}

export async function patchGoal({
    goal,
    project_id,
}: {
    goal: GoalInput
    project_id: string
}): Promise<GoalOutput> {
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/goal/${
                goal.id
            }/`,
            goal
        )
    ).data
}

export async function deleteGoal({ id, project_id }): Promise<void> {
    return await axios.delete(
        `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/goal/${id}/`
    )
}
