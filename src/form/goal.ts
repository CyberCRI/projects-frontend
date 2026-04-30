import type { GoalForm } from '@/models/goal.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultForm = (): GoalForm => ({
  title: '',
  description: NULL_CONTENT,
  status: 'na',
  deadline_at: null,
})
