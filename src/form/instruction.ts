import { InstructionForm } from '@/models/instruction.model'

export const defaultForm = (): InstructionForm => ({
  title: '',
  content: '<p></p>',
  publication_date: new Date().toISOString(),
  has_to_be_notified: false,
  people_groups: {},
  visible_by_all: true,
})
