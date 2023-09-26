import { createFactory } from 'faker-create-factory'
import { ProjectReviewerModel, ProjectReviewerInput } from '@/models/project-reviewer'
import BaseFactory from './base.factory'

export const ProjectReviewerFactory = createFactory<ProjectReviewerModel>((faker) => ({
    ...BaseFactory.generate(),
    reviewer: faker.datatype.number(),
}))

export const ProjectReviewerInputFactory = createFactory<ProjectReviewerInput>((faker) => ({
    ...ProjectReviewerFactory.generate(),
    project_id: faker.datatype.string(),
}))
