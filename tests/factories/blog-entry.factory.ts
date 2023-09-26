import { createFactory } from 'faker-create-factory'

import { BlogEntryOutput, BlogEntryInput } from '@/models/blog-entry.model'
import BaseFactory from './base.factory'

export const BlogEntryFactory = createFactory<BlogEntryOutput>((faker) => ({
    ...BaseFactory.generate(),
    title: faker.lorem.word(),
    content: faker.lorem.sentence(),
}))

export const BlogEntryInputFactory = createFactory<BlogEntryInput>((faker) => ({
    ...BlogEntryFactory.generate(),
    project_id: faker.datatype.string(),
    blog_entry_id: faker.datatype.string(),
}))

export default BlogEntryFactory
