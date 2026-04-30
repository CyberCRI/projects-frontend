import type { InstructionForm } from '@/models/instruction.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultForm = (): InstructionForm => ({
  title: '',
  content: NULL_CONTENT,
  publication_date: new Date().toISOString(),
  has_to_be_notified: false,
  people_groups: {},
  visible_by_all: true,
})
