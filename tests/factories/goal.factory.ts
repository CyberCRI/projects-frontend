import { createFactory } from 'faker-create-factory'

import { GoalModel, TranslatedGoal } from '~/models/goal.model'
import BaseFactory from './base.factory'

export const GoalFactory = createFactory<GoalModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.datatype.string(),
  description: faker.lorem.sentence(),
  deadline_at: faker.datatype.datetime().toISOString(),
  status: 'ongoing',
}))

export const TranslatedGoalFactory = createFactory<TranslatedGoal>((faker) => ({
  ...GoalFactory.generate(),
  $t: {
    title: faker.datatype.string(),
    description: faker.lorem.sentence(),
  },
}))
