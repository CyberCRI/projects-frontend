import { InstructionModel } from '@/models/instruction.model'
import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'
import { peopleGroupFactory } from './group.factory'

export const InstructionFactory = createFactory<InstructionModel>((faker) => ({
  ...BaseFactory.generate(),
  content: faker.lorem.paragraph(),
  title: faker.lorem.sentence(),
  publication_date: faker.datatype.datetime().toISOString(),
  id: faker.datatype.number(),
  has_to_be_notified: faker.datatype.boolean(),
  people_groups: peopleGroupFactory.generateMany(10),
  visible_by_all: faker.datatype.boolean(),
}))
