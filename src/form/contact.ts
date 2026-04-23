import { ContactModel } from '@/models/report.model'

export const defaultForm = (): ContactModel => ({
  subject: '',
  email: '',
  content: '',
})
