import { MentoringContactForm } from '@/models/mentoring.model'

export const defaultForm = (): MentoringContactForm => ({
  title: '',
  content: '',
  reply_to: '',
})
