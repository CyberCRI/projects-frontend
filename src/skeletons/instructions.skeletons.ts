import { InstructionModel } from '~/models/instruction.model'

export const instructionSkeleton = (def?: Partial<InstructionModel>): InstructionModel => ({
  id: -1,
  title: 'Ipsum nostrud officia',
  content: 'Ipsum nostrud officia dolor esse exercitation mollit',
  publication_date: new Date().toISOString(),
  has_to_be_notified: false,
  people_groups: [],
  ...(def || {}),
})
