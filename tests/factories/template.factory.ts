import { createFactory } from 'faker-create-factory'

import { TemplateCreateInput, TemplateModel } from '@/models/template.model'
import { ImageFactory } from './image.factory'
import BaseFactory from './base.factory'

export const TemplateFactory = createFactory<TemplateModel>((faker) => ({
    ...BaseFactory.generate(),
    title_placeholder: faker.datatype.string(),
    goal_placeholder: faker.datatype.string(),
    description_placeholder: faker.datatype.string(),
    blogentry_placeholder: faker.datatype.string(),
    images: ImageFactory.generateMany(2),
}))

export const TemplateInputFactory = createFactory<TemplateCreateInput>((faker) => ({
    ...TemplateFactory.generate(),
    project_categories_ids: [faker.datatype.number()],
}))

export default TemplateFactory
