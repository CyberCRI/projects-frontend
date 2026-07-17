import { OrganizationFactory } from '~~/tests/factories/organization.factory'
import type { Mentoring } from 'shared-projects-frontend/models'
import { SkillFactory } from '~~/tests/factories/skill.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'

export const MentoringFactory = createFactory<Mentoring>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  organization: OrganizationFactory.generate(),
  mentor: UserFactory.generate(),
  mentoree: UserFactory.generate(),
  skill: SkillFactory.generate(),
  status: faker.random.arrayElement(['pending', 'accepted', 'rejected']),
  create_by: UserFactory.generate(),
  created_at: faker.datatype.datetime().toISOString(),
}))
