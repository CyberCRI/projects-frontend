import type { ContactModel } from '@/models/report.model'

export const defaultContactForm = (): ContactModel => ({
  subject: '',
  email: '',
  content: '',
})
