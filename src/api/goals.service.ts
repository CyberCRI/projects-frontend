import type { GoalInput /*, GoalOutput*/, GoalModel } from '@/models/goal.model'
// import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'
import { ProjectSlugOrId } from '@/models/project.model'

type ConfigGoal = UseApiOptions

export async function getAllGoals(projectId: ProjectSlugOrId, config: ConfigGoal = {}) {
  return await useAPI<PaginationResult<GoalModel>>(`project/${projectId}/goal/`, config)
}

export async function createGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
  return await useAPI(`project/${project_id}/goal/ `, { body: goal, method: 'POST' }) //.data.value
}

export async function patchGoal({ goal, project_id }: { goal: GoalInput; project_id: string }) {
  return await useAPI(`project/${project_id}/goal/${goal.id}/`, { body: goal, method: 'PATCH' })
  //.data.value
}

export async function deleteGoal({ id, project_id }) {
  return await useAPI(`project/${project_id}/goal/${id}/`, { method: 'DELETE' })
}
