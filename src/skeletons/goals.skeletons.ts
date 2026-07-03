import type { GoalModel } from 'shared-projects-frontend/models/goal.model'

export const goalSkeletons = (def?: Partial<GoalModel>): Omit<GoalModel, 'id'> => ({
  title: 'title',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  deadline_at: new Date().toISOString(),
  status: 'complete',
  ...(def || {}),
})
