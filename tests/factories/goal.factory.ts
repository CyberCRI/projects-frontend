import { createFactory } from 'faker-create-factory'

import { GoalInput, GoalModel, TranslatedGoal } from '~/models/goal.model'
import BaseFactory from './base.factory'

export const GoalFactory = createFactory<GoalModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.datatype.string(),
  description: faker.lorem.sentence(),
  deadline_at: faker.date.soon().toISOString(),
  status: 'ongoing',
}))

export const TranslatedGoalFactory = createFactory<TranslatedGoal>((faker) => ({
  ...GoalFactory.generate(),
  $t: {
    title: faker.datatype.string(),
    description: faker.lorem.sentence(),
  },
}))

export const GoalInputFactory = createFactory<GoalInput>((faker) => ({
  ...GoalFactory.generate(),
  project_id: faker.datatype.string(),
  goal_id: faker.datatype.string(),
}))
