import type { MentoringContactForm } from '@/models/mentoring.model'

export const defaultMentoringForm = (): MentoringContactForm => ({
  title: '',
  content: '',
  reply_to: '',
})

export const defaultMentorship = () => ({
  can_mentor: false,
  needs_mentor: false,
  comment: '',
})
