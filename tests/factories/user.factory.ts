import { createFactory } from 'faker-create-factory'

import { UserModel, UserFromJWTModel } from '@/models/user.model'

export const UserFactory = createFactory<UserModel>((faker) => ({
    id: faker.datatype.uuid(),
    name: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
    },
    email: faker.internet.email(),
    roles: [
        '/ClientsAdmin',
        '/projects/ClientsAdmin',
        '/projects/organizations/CRI/administrators',
        '/projects/organizations/CRI/external',
        '/projects/organizations/OTHER_ORG/external',
    ],
    orgs: ['CRI', 'OTHER_ORG'],
    permissions: [''],
}))

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
