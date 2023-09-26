import { createFactory } from 'faker-create-factory'

import { PeopleModel } from '@/models/people.model'

export const PeopleFactory = createFactory<PeopleModel>((faker) => ({
    date: new Date(),
    gid: faker.datatype.uuid(),
    groups: [
        '/ClientsAdmin',
        '/projects/ClientsAdmin',
        '/projects/organizations/CRI/administrators',
        '/projects/organizations/CRI/external',
    ],
    invite_expire: new Date(),
    kid: faker.datatype.uuid(),
    maingroup: faker.datatype.string(),
    name: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        fullname: faker.name.firstName() + faker.name.lastName(),
    },
    personnalmail: faker.internet.email(),
    pic: faker.image.image(),
    pid: faker.datatype.uuid(),
    primaryemail: faker.internet.email(),
    org: faker.datatype.string(),
    role: faker.datatype.string(),
    room: faker.datatype.string(),
    state: faker.datatype.string(),
    title: faker.name.title(),
    type: faker.datatype.string(),
    urlname: faker.datatype.string(),
}))

export default PeopleFactory
