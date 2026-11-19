import { createFactory } from 'faker-create-factory'

import type {
  UserModel,
  UserFromJWTModel,
  TranslatedUserModel,
} from 'shared-projects-frontend/models'

export const UserFactory = createFactory<UserModel>((faker) => ({
  id: faker.datatype.number(),
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
  permissions: [],
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
  modules: {
    conferences: 0,
    files: 0,
    follows_categories: 0,
    follows_projects: 0,
    groups: 0,
    links: 0,
    mentor: 0,
    mentoree: 0,
    projects: 0,
    publications: 0,
    skills: 0,
    notifications: 0,
    reviews_projects: 0,
  },
  created_at: faker.datatype.datetime().toISOString(),
  landline_phone: null,
  location: '',
  mobile_phone: null,
  skype: null,
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
