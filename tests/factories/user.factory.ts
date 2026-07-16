import { createFactory } from 'faker-create-factory'

import type {
  UserModel,
  UserFromJWTModel,
  TranslatedUserModel,
} from 'shared-projects-frontend/models'
import { groupTranslatedFactory } from '~~/tests/factories/group.factory'

export const UserFactory = createFactory<UserModel>((faker) => ({
  id: faker.datatype.number(),
  name: {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  },
  given_name: faker.name.firstName(),
  family_name: faker.name.lastName(),
  email: faker.internet.email(),
  description: faker.lorem.paragraph(),
  roles: [
    '/ClientsAdmin',
    '/projects/ClientsAdmin',
    '/projects/organizations/CRI/administrators',
    '/projects/organizations/CRI/external',
    '/projects/organizations/OTHER_ORG/external',
  ],
  orgs: ['CRI', 'OTHER_ORG'],
  permissions: [''],
  people_groups: [], // TODO: generate this
  skills: [], // TODO: generate this
  profile_picture: {
    id: faker.datatype.number(),
    name: faker.lorem.sentence(),
    file: faker.image.imageUrl(),
    url: faker.image.imageUrl(),
    scale_x: faker.datatype.number(),
    scale_y: faker.datatype.number(),
    left: faker.datatype.number(),
    top: faker.datatype.number(),
    natural_ratio: faker.datatype.number(),
    variations: {
      full: faker.image.imageUrl(),
      large: faker.image.imageUrl(),
      medium: faker.image.imageUrl(),
      original: faker.image.imageUrl(),
      small: faker.image.imageUrl(),
    },
  },
  researcher: null,
  slug: '',
  resources: {
    files: faker.datatype.number(),
    links: faker.datatype.number(),
  },
  privacy_settings: {
    email: 'org',
    mobile_phone: 'org',
    profile_picture: 'org',
    publication_status: 'org',
    skills: 'org',
    socials: 'org',
  },
  facebook: null,
  is_superuser: false,
  linkedin: null,
  twitter: null,
  website: null,
}))

export const userTranslatedFactory = createFactory<TranslatedUserModel>(() => {
  const user = UserFactory.generate()
  return {
    ...user,
    $t: {
      description: user.description,
      job: user.job,
      short_description: user.short_description,
    },
    people_groups: groupTranslatedFactory.generateMany(user.people_groups?.length || 0),
  }
})

export const UserFromJWTFactory = createFactory<UserFromJWTModel>((faker) => ({
  id: faker.datatype.uuid(),
  given_name: faker.name.firstName(),
  family_name: faker.name.lastName(),
  email: faker.internet.email(),
  groups: [
    '/ClientsAdmin',
    '/projects/ClientsAdmin',
    '/projects/organizations/CRI/administrators',
    '/projects/organizations/CRI/external',
    '/projects/organizations/OTHER_ORG/external',
  ],
  sub: faker.datatype.uuid(),
}))
