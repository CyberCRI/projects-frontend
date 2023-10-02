import { createFactory } from 'faker-create-factory'

import { PeopleModel } from '@/models/people.model'

export const PeopleFactory = createFactory<PeopleModel>((faker) => ({
    slug: faker.datatype.string(),
    roles: [],
    permissions: [],
    is_superuser: false,
    people_groups: [],
    notifications: 0,
    privacy_settings: {},
    skills: [],
    hobbies: [],
    id: faker.datatype.number(),
    language: faker.datatype.string(),
    keycloak_id: faker.datatype.uuid(), // Keycloak user id
    people_id: faker.datatype.uuid(), // user id
    email: faker.internet.email(),
    given_name: faker.name.firstName(),
    family_name: faker.name.lastName(),
    birthday: null,
    pronouns: faker.datatype.string(),
    personal_description: faker.lorem.paragraph(),
    short_description: faker.lorem.paragraph(),
    professional_description: faker.lorem.paragraph(),
    location: faker.datatype.string(),
    job: faker.datatype.string(),
    mobile_phone: faker.datatype.string(),
    personnal_email: faker.internet.email(),
    sdgs: [],
    facebook: faker.datatype.string(),
    linkedin: faker.datatype.string(),
    medium: faker.datatype.string(),
    website: faker.datatype.string(),
    skype: faker.datatype.string(),
    landline_phone: faker.datatype.string(),
    twitter: faker.datatype.string(),
}))

export default PeopleFactory
