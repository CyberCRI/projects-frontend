import { createFactory } from 'faker-create-factory'

import { OrganizationDirectoryModel } from 'shared-projects-frontend'
import BaseFactory from './base.factory'

export const OrganizationDirectoryFactory = createFactory<OrganizationDirectoryModel>((faker) => ({
  ...BaseFactory.generate(),
  name: faker.name.title(),
  description: faker.lorem.sentences(),
  logo: faker.image.image(),
  language: 'fr',
}))

export default OrganizationDirectoryFactory
