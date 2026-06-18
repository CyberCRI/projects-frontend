import type { GoalForm, GoalModel } from '@/models/goal.model'
import type { ProjectSlugOrId } from '@/models/project.model'
import useAPI from '@/composables/useAPI'

type ConfigGoal = UseApiOptions

export async function getProjectGoals(projectId: ProjectSlugOrId, config: ConfigGoal = {}) {
  return await useAPI<PaginationResult<GoalModel>>(`project/${projectId}/goal/`, config)
}

export async function createProjectGoal(projectId: ProjectSlugOrId, body: GoalForm, config = {}) {
  return await useAPI<GoalModel>(`project/${projectId}/goal/`, { ...config, body, method: 'POST' })
}

export async function patchProjectGoal(
  projectId: ProjectSlugOrId,
  goalId: GoalModel['id'],
  body: GoalForm,
  config = {}
) {
  return await useAPI<GoalModel>(`project/${projectId}/goal/${goalId}/`, {
    ...config,
    body,
    method: 'PATCH',
  })
}

export async function deleteProjectGoal(
  projectId: ProjectSlugOrId,
  goalId: GoalModel['id'],
  config = {}
) {
  return await useAPI<undefined>(`project/${projectId}/goal/${goalId}/`, {
    ...config,
    method: 'DELETE',
  })
}
