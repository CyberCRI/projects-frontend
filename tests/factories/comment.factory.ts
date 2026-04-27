import { createFactory } from 'faker-create-factory'

import { CommentInputModel, CommentOutput } from '@/models/comment.model'
import BaseFactory from './base.factory'
import { UserFactory } from './user.factory'

export const CommentFactory = createFactory<CommentOutput>((faker) => ({
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

export const CommentInputFactory = createFactory<CommentInputModel>((faker) => ({
  ...CommentFactory.generate(),
  project_id: faker.datatype.string(),
  author_id: faker.datatype.number(),
  reply_on_id: faker.datatype.number(),
  comment_id: faker.datatype.string(),
}))
