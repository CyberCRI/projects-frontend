import type { GoalInput, GoalOutput } from '@/models/goal.model'
import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getAllGoals(id) {
    return (await useAPI(`project/${id}/goal/`, {})).data
}

export async function createGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
    return (
        await useAPI(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${project_id}/goal/ `,
            { body: goal, method: 'POST' }
        )
    ).data
}

export async function patchGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
    return (await useAPI(`project/${project_id}/goal/${goal.id}/`, { body: goal, method: 'PATCH' }))
        .data
}

export async function deleteGoal({ id, project_id }) {
    return await useAPI(`project/${project_id}/goal/${id}/`, {})
}
