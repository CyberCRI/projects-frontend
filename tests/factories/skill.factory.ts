import { createFactory } from 'faker-create-factory'

import OrganizationTagFactory from '~~/tests/factories/tag.factory'
import { UserSkillModel } from '~/models/user.model'
import BaseFactory from './base.factory'

const UserSkillFactory = createFactory<UserSkillModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  can_mentor: faker.datatype.boolean(),
  tag: OrganizationTagFactory.generate(),
  user: null,
  type: 'skill',
  comment: '',
  level: faker.datatype.number(),
  level_to_reach: faker.datatype.number(),
  needs_mentor: faker.datatype.boolean(),
  category: '',
}))

export default UserSkillFactory
