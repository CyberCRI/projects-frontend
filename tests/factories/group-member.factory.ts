import { createFactory } from 'faker-create-factory'

import BaseFactory from './base.factory'
// import {
//     ProjectMembersAddEntry,
//     ProjectMembersAddInput,
//     ProjectMemberModel,
//     ProjectMembersDeleteInput,
//     ProjectMemberPeopleGroupOutput,
//     ProjectTeamModel,
// } from '@/models/project-member.model'

// todo use groupmember model
export const GroupMemberFactory = createFactory<any>((faker) => ({
  ...BaseFactory.generate(),

  id: faker.datatype.number(),
  given_name: faker.name.firstName(),
  family_name: faker.name.lastName(),
  is_leader: false,
  is_manager: false,
  profile_picture: { variations: {} },
}))

export default GroupMemberFactory
