import { createFactory } from 'faker-create-factory'

import type { CommentModel } from 'shared-projects-frontend/models'
import { UserFactory } from './user.factory'
import BaseFactory from './base.factory'

export const CommentFactory = createFactory<CommentModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  author: UserFactory.generate(),
  content: faker.datatype.string(),
  replies: [],
  deleted_at: faker.datatype.datetime().toISOString(),
  updated_at: faker.datatype.datetime().toISOString(),
  created_at: faker.datatype.datetime().toISOString(),
  images: [],
}))
