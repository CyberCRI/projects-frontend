import { createFactory } from 'faker-create-factory'

import { TemplateCreateInput, TemplateModel } from '~/models/template.model'
import { OrganizationFactory } from './organization.factory'
import { ImageFactory } from './image.factory'
import BaseFactory from './base.factory'

export const TemplateFactory = createFactory<TemplateModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  name: faker.lorem.paragraph(),
  description: faker.lorem.paragraph(),
  language: 'en',
  categories: [],
  organization: OrganizationFactory.generate(),
  images: ImageFactory.generateMany(2),
  blogentry_content: faker.datatype.string(),
  comment_content: faker.datatype.string(),
  goal_description: faker.datatype.string(),
  project_purpose: faker.datatype.string(),
  project_tags: [],
  review_description: faker.datatype.string(),
  review_title: faker.datatype.string(),
  blogentry_title: faker.datatype.string(),
  goal_title: faker.datatype.string(),
  project_description: faker.datatype.string(),
  project_title: faker.datatype.string(),
}))

export const TemplateInputFactory = createFactory<TemplateCreateInput>((faker) => ({
  ...BaseFactory.generate(),
  ...TemplateFactory.generate(),
  project_categories_ids: [faker.datatype.number()],
}))

export default TemplateFactory
