import type { MentoringContactForm } from 'shared-projects-frontend'

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
