import { createFactory } from 'faker-create-factory'

import {
  ProjectCategoryCreateInput,
  ProjectCategoryOutput,
  ProjectCategoryPatchInput,
} from '@/models/project-category.model'
import BaseFactory from './base.factory'
import TagFactory from './tag.factory'
import { OrganizationOutputFactory } from './organization.factory'
import TemplateFactory from './template.factory'

const ProjectCategoryFactory = createFactory<ProjectCategoryOutput>((faker) => ({
  ...BaseFactory.generate(),
  slug: faker.datatype.string(),
  organization_code: faker.datatype.string(),
  background_color: faker.internet.color(),
  background_image: {
    scale_x: faker.datatype.number(),
    scale_y: faker.datatype.number(),
    left: faker.datatype.number(),
    top: faker.datatype.number(),
    natural_ratio: faker.datatype.number(),
    file: faker.image.image(),
    name: faker.name.lastName(),
    height: faker.datatype.number(),
    width: faker.datatype.number(),
    variations: {
      full: faker.image.image(),
      large: faker.image.image(),
      medium: faker.image.image(),
      original: faker.image.image(),
      small: faker.image.image(),
    },
  },
  description: faker.lorem.sentences(),
  foreground_color: faker.internet.color(), // Text color
  is_reviewable: faker.datatype.string(),
  name: faker.name.title(),
  order_index: faker.datatype.number(),
  template: TemplateFactory.generate(),
  organization: OrganizationOutputFactory.generate(),
  tags: TagFactory.generateMany(2),
  children: [],
  hierarchy: [],
}))

export const ProjectCategoryOutputFactory = createFactory<ProjectCategoryOutput>(() => ({
  ...ProjectCategoryFactory.generate(),
  template: TemplateFactory.generate(),
  organization: OrganizationOutputFactory.generate(),
  tags: TagFactory.generateMany(2),
}))

export const ProjectCategoryCreateInputFactory = createFactory<ProjectCategoryCreateInput>(
  (faker) => ({
    ...ProjectCategoryFactory.generate(),
    organization_code: faker.datatype.string(),
    tags: TagFactory.generateMany(2).map((tag) => <number>tag.id),
  })
)

export const ProjectCategoryPatchInputFactory = createFactory<ProjectCategoryPatchInput>(
  (faker) => ({
    ...ProjectCategoryFactory.generate(),
    tags: TagFactory.generateMany(2).map((tag) => <number>tag.id),
  })
)
