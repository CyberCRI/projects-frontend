import { createFactory } from 'faker-create-factory'

import { GoalInput, GoalModel } from '@/models/goal.model'
import BaseFactory from './base.factory'

export const GoalFactory = createFactory<GoalModel>((faker) => ({
  ...BaseFactory.generate(),
  title: faker.datatype.string(),
  description: faker.lorem.sentence(),
  deadline_at: new Date(),
  status: 'ongoing',
}))

export const GoalInputFactory = createFactory<GoalInput>((faker) => ({
  ...GoalFactory.generate(),
  project_id: faker.datatype.string(),
  goal_id: faker.datatype.string(),
}))
