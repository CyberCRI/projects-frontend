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

export const ProjectCategoryFactory = createFactory<ProjectCategoryOutput>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  slug: faker.datatype.string(),
  organization_code: faker.datatype.string(),
  background_color: faker.internet.color(),
  background_image: {
    scale_x: faker.datatype.number(),
    scale_y: faker.datatype.number(),
    left: faker.datatype.number(),
    top: faker.datatype.number(),
    url: faker.internet.url(),
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
  is_reviewable: faker.datatype.boolean(),
  name: faker.name.title(),
  order_index: faker.datatype.number(),
  template: TemplateFactory.generate(),
  organization: OrganizationOutputFactory.generate().code,
  tags: TagFactory.generateMany(2),
  children: [],
  hierarchy: [],
  projects_count: faker.datatype.number(),
}))

export const ProjectCategoryOutputFactory = createFactory<ProjectCategoryOutput>(() => ({
  ...ProjectCategoryFactory.generate(),
  template: TemplateFactory.generate(),
  organization: OrganizationOutputFactory.generate().code,
  tags: TagFactory.generateMany(2),
}))

export const ProjectCategoryCreateInputFactory = createFactory<ProjectCategoryCreateInput>(
  (faker) => ({
    ...ProjectCategoryFactory.generate(),
    organization_code: faker.datatype.string(),
    tags: TagFactory.generateMany(2).map((tag) => <number>tag.id),
  })
)

export const ProjectCategoryPatchInputFactory = createFactory<ProjectCategoryPatchInput>(() => ({
  ...ProjectCategoryFactory.generate(),
  tags: TagFactory.generateMany(2).map((tag) => tag.id),
}))
