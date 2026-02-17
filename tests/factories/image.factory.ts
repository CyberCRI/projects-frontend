import { createFactory } from 'faker-create-factory'

import {
  ImageOutput,
  ImageInput,
  ImageOrganizationInput,
  ImageTemplateInput,
} from '@/models/image.model'

import BaseFactory from './base.factory'

export const ImageFactory = createFactory<ImageOutput>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  url: faker.internet.url(),
  scale_x: faker.datatype.number(),
  scale_y: faker.datatype.number(),
  left: faker.datatype.number(),
  top: faker.datatype.number(),
  natural_ratio: faker.datatype.number(),
  file: faker.internet.url(),
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
}))

export const ImageInputFactory = createFactory<ImageInput>((faker) => ({
  ...ImageFactory.generate(),
  project_id: faker.datatype.string(),
}))

export const ImageOrganizationInputFactory = createFactory<ImageOrganizationInput>((faker) => ({
  ...ImageFactory.generate(),
  organization_code: faker.datatype.string(),
}))

export const ImageTemplateInputFactory = createFactory<ImageTemplateInput>((faker) => ({
  ...ImageFactory.generate(),
  template_id: faker.datatype.number(),
}))
