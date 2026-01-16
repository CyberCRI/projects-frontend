import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'
import { GroupModel, GroupModelInput } from '@/models/group.model'
import { PeopleGroupModel, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { ImageFactory } from './image.factory'
import { OrganizationOutputFactory } from './organization.factory'

export const groupFactory = createFactory<GroupModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  name: faker.datatype.string(),
  permissions: [],
  users: [],
}))

export const groupInputFactory = createFactory<GroupModelInput>((faker) => ({
  user_ids: [],
}))

export const peopleGroupFactory = createFactory<PeopleGroupModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  slug: faker.name.title(),
  name: faker.name.title(),
  description: faker.lorem.text(100),
  short_description: faker.lorem.text(20),
  email: faker.internet.email(),
  type: faker.datatype.string(),
  header_image: ImageFactory.generate(),
  publication_status: faker.datatype.string(),
  organization: OrganizationOutputFactory.generate(),
  children: [],
  modules: {
    members: 0,
    featured_projects: 0,
  },
  hierarchy: null,
}))

export const groupTranslatedFactory = createFactory<TranslatedPeopleGroupModel>((faker) => ({
  ...peopleGroupFactory.generate(),
  $t: {
    name: faker.name.title(),
    description: faker.lorem.text(100),
    short_description: faker.lorem.text(20),
  },
}))
