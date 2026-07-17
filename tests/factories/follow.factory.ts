import { createFactory } from 'faker-create-factory'

import type { FollowModel, FollowInput } from 'shared-projects-frontend/models'
import { ProjectFactory } from '~~/tests/factories/project.factory'
import { BaseFactory } from './base.factory'

export const FollowFactory = createFactory<FollowModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  follower: {
    id: faker.datatype.number(),
    email: faker.datatype.string(),
    given_name: faker.datatype.string(),
    family_name: faker.datatype.string(),
  },
  project: ProjectFactory.generate(),
}))

export const FollowInputFactory = createFactory<FollowInput>((faker) => ({
  project_id: faker.datatype.string(),
  follower_id: faker.datatype.number(),
}))

export default FollowFactory
