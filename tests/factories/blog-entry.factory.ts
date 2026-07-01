import { createFactory } from 'faker-create-factory'

import { BlogEntryModel } from '~/models/blog-entry.model'
import BaseFactory from './base.factory'

export const BlogEntryFactory = createFactory<BlogEntryModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.lorem.word(),
  content: faker.lorem.sentence(),
  updated_at: faker.datatype.datetime().toISOString(),
  created_at: faker.datatype.datetime().toISOString(),
  images: [],
}))

export default BlogEntryFactory
