import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'
import { GroupModel, GroupModelInput } from '@/models/group.model'

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
