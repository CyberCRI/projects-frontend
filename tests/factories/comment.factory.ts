import { createFactory } from 'faker-create-factory'

import { CommentInputModel, CommentOutput } from '@/models/comment.model'
import BaseFactory from './base.factory'

export const CommentFactory = createFactory<CommentOutput>((faker) => ({
    ...BaseFactory.generate(),
    author: {
        email: faker.datatype.string(),
        family_name: faker.datatype.string(),
        given_name: faker.datatype.string(),
        id: faker.datatype.number(),
        people_id: faker.datatype.string(),
    },
    content: faker.datatype.string(),
    replies: [],
    deleted_at: faker.datatype.datetime(),
}))

export const CommentInputFactory = createFactory<CommentInputModel>((faker) => ({
    ...CommentFactory.generate(),
    project_id: faker.datatype.string(),
    author_id: faker.datatype.number(),
    reply_on_id: faker.datatype.number(),
    comment_id: faker.datatype.string(),
}))
