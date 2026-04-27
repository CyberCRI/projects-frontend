import { createFactory } from 'faker-create-factory'
import { ReviewModel, ReviewModelInput } from '@/models/review.model'
import BaseFactory from './base.factory'
import { UserFactory } from './user.factory'

export const ReviewFactory = createFactory<ReviewModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  description: faker.datatype.string(),
  title: faker.datatype.string(),
  reviewer: UserFactory.generate(),
  created_at: faker.datatype.datetime().toISOString(),
  updated_at: faker.datatype.datetime().toISOString(),
}))

export const ReviewInputFactory = createFactory<ReviewModelInput>((faker) => ({
  ...ReviewFactory.generate(),
  reviewer_id: faker.datatype.uuid(),
  project_id: faker.datatype.uuid(),
}))
