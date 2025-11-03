import { createFactory } from 'faker-create-factory'

import { TemplateCreateInput, TemplateModel } from '@/models/template.model'
import { ImageFactory } from './image.factory'
import BaseFactory from './base.factory'

export const TemplateFactory = createFactory<TemplateModel>((faker) => ({
  ...BaseFactory.generate(),
  project_title: faker.datatype.string(),
  goal_title: faker.datatype.string(),
  project_description: faker.datatype.string(),
  blogentry_title: faker.datatype.string(),
  images: ImageFactory.generateMany(2),
}))

export const TemplateInputFactory = createFactory<TemplateCreateInput>((faker) => ({
  ...TemplateFactory.generate(),
  project_categories_ids: [faker.datatype.number()],
}))

export default TemplateFactory
