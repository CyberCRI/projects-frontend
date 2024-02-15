import { createFactory } from 'faker-create-factory'
import { ReviewModel, ReviewModelInput } from '@/models/review.model'
import BaseFactory from './base.factory'

export const ReviewFactory = createFactory<ReviewModel>((faker) => ({
    ...BaseFactory.generate(),
    description: faker.datatype.string(),
    title: faker.datatype.string(),
    reviewer: {
        id: faker.datatype.number(),
        people_id: faker.datatype.string(),
        email: faker.datatype.string(),
        given_name: faker.datatype.string(),
        family_name: faker.datatype.string(),
    },
}))

export const ReviewInputFactory = createFactory<ReviewModelInput>((faker) => ({
    ...ReviewFactory.generate(),
    reviewer_id: faker.datatype.uuid(),
    project_id: faker.datatype.uuid(),
}))
