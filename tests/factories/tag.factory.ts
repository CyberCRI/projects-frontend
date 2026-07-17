import { createFactory } from 'faker-create-factory'

import type { TagModel } from 'shared-projects-frontend/models'
import BaseFactory from './base.factory'

const TagFactory = createFactory<TagModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.name.title(),
  title_en: faker.name.title(),
  title_fr: faker.name.title(),
  description: faker.name.title(),
  description_fr: faker.name.title(),
  description_en: faker.name.title(),
  type: faker.random.arrayElement(['Wikipedia', 'Custom', 'ESCO']),
  secondary_type: faker.random.arrayElement(['skill', 'occupation', 'tag']),
  organization: faker.datatype.string(),
}))

export default TagFactory
