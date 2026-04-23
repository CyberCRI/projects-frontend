import { createFactory } from 'faker-create-factory'

import { TemplateCreateInput, TemplateModel } from '@/models/template.model'
import { ImageFactory } from './image.factory'
import BaseFactory from './base.factory'
import { OrganizationFactory } from './organization.factory'

export const TemplateFactory = createFactory<TemplateModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  name: faker.lorem.paragraph(),
  description: faker.lorem.paragraph(),

  language: 'en',
  categories: [],
  organization: OrganizationFactory.generate(),

  images: ImageFactory.generateMany(2),

  project_title: faker.lorem.paragraph(),
  project_description: faker.lorem.paragraph(),
  project_purpose: faker.lorem.paragraph(),
  project_tags: faker.lorem.paragraph(),
  blogentry_title: faker.lorem.paragraph(),
  blogentry_content: faker.lorem.paragraph(),
  goal_title: faker.lorem.paragraph(),
  goal_description: faker.lorem.paragraph(),
  review_title: faker.lorem.paragraph(),
  review_description: faker.lorem.paragraph(),
  comment_content: faker.lorem.paragraph(),
}))

export const TemplateInputFactory = createFactory<TemplateCreateInput>((faker) => ({
  ...BaseFactory.generate(),
  ...TemplateFactory.generate(),
  project_categories_ids: [faker.datatype.number()],
}))

export default TemplateFactory
