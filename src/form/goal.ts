import type { GoalForm } from '@/models/goal.model'

export const defaultForm = (): GoalForm => ({
  title: '',
  description: '<p></p>',
  status: 'na',
  deadline_at: null,
})
