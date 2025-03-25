import { createFactory } from 'faker-create-factory'

import { FollowModel, FollowInput } from '@/models/follow.model'
import { BaseFactory } from './base.factory'

export const FollowFactory = createFactory<FollowModel>((faker) => ({
  ...BaseFactory.generate(),
  follower: {
    id: faker.datatype.number(),
    email: faker.datatype.string(),
    given_name: faker.datatype.string(),
    family_name: faker.datatype.string(),
  },
}))

export const FollowInputFactory = createFactory<FollowInput>((faker) => ({
  project_id: faker.datatype.string(),
  follower_id: faker.datatype.number(),
}))

export default FollowFactory
