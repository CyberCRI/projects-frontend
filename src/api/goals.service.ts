import type { GoalInput /*, GoalOutput*/, GoalModel } from '@/models/goal.model'
import type { ProjectSlugOrId } from '@/models/project.model'
// import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'

type ConfigGoal = UseApiOptions

export async function getAllGoals(projectId: ProjectSlugOrId, config: ConfigGoal = {}) {
  return await useAPI<PaginationResult<GoalModel>>(`project/${projectId}/goal/`, config)
}

export async function createGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
  return await useAPI(`project/${project_id}/goal/ `, { body: goal, method: 'POST' })
}

export async function patchGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
  return await useAPI(`project/${project_id}/goal/${goal.id}/`, { body: goal, method: 'PATCH' })
}

export async function deleteGoal({ id, project_id }) {
  return await useAPI(`project/${project_id}/goal/${id}/`, { method: 'DELETE' })
}
