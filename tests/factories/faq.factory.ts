import { createFactory } from 'faker-create-factory'

import { FaqModel, FaqImageModel, FaqInput } from '@/models/faq.model'
import BaseFactory from './base.factory'

export const FaqFactory = createFactory<FaqModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  organization_code: faker.datatype.number(),
  title: faker.name.title(),
  content: faker.lorem.paragraphs(),
  images: FaqImageFactory.generateMany(2),
}))

export const FaqInputFactory = createFactory<FaqInput>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  organization_code: faker.datatype.string(),
  title: faker.name.title(),
  content: faker.lorem.paragraphs(),
  images: FaqImageFactory.generateMany(2),
}))

export const FaqImageFactory = createFactory<FaqImageModel>((faker) => ({
  ...BaseFactory.generate(),
  file: faker.datatype.string(),
  name: faker.datatype.string(),
  gallery: faker.datatype.string(),
}))

export default FaqFactory
