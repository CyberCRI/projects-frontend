import type { GoalForm, GoalModel } from '@/models/goal.model'
import useAPI from '@/composables/useAPI'
import { ProjectModel } from '@/models/project.model'

export async function getAllGoals(projectId: ProjectModel['id'], config = {}) {
  return await useAPI(`project/${projectId}/goal/`, config)
}

export async function createGoal(projectId: ProjectModel['id'], body: GoalForm, config = {}) {
  return await useAPI<GoalModel>(`project/${projectId}/goal/`, { ...config, body, method: 'POST' })
}

export async function patchGoal(
  projectId: ProjectModel['id'],
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

export async function deleteGoal(
  projectId: ProjectModel['id'],
  goalId: GoalModel['id'],
  config = {}
) {
  return await useAPI<void>(`project/${projectId}/goal/${goalId}/`, { ...config, method: 'DELETE' })
}
