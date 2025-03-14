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
  file: faker.internet.url(),
  name: faker.lorem.word(),
  height: faker.datatype.number(),
  width: faker.datatype.number(),
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
