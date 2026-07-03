import { ReviewModel } from 'shared-projects-frontend/models/review.model'
import { createFactory } from 'faker-create-factory'
import { UserFactory } from './user.factory'
import BaseFactory from './base.factory'

export const ReviewFactory = createFactory<ReviewModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  description: faker.datatype.string(),
  title: faker.datatype.string(),
  reviewer: UserFactory.generate(),
  created_at: faker.datatype.datetime().toISOString(),
  updated_at: faker.datatype.datetime().toISOString(),
}))
