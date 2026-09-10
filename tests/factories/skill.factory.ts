import { createFactory } from 'faker-create-factory'

import type { SkillModel } from 'shared-projects-frontend/models'
import TagFactory from '~~/tests/factories/tag.factory'
import BaseFactory from './base.factory'

export const SkillFactory = createFactory<SkillModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  tag: TagFactory.generate(),
  user: null,
  level: faker.datatype.number(),
  level_to_reach: faker.datatype.number(),
  can_mentor: faker.datatype.boolean(),
  type: 'skill',
  comment: '',
  needs_mentor: faker.datatype.boolean(),
  category: '',
}))
