import type { TranslatedUserModel, UserModel } from '~/models/user.model'
import type { ProjectMemberRoleType } from '~/models/types'
import type BaseModel from '~/models/base.model'

/**
 * Member of a project
 *
 * @typedef
 * @name ProjectMemberModel
 * @kind variable
 * @exports
 */
export type ProjectMemberModel = UserModel & {
  role: ProjectMemberRoleType
}

export type TranslatedPojectMember = TranslatedUserModel & Pick<ProjectMemberModel, 'role'>

export interface ProjectTeamModel extends BaseModel {
  reviewers: ProjectMemberModel[]
  members: ProjectMemberModel[]
  owners: ProjectMemberModel[]
  people_groups: ProjectMemberPeopleGroupOutput[]
}

export type ProjectMembersAddEntry = {
  user: string // keycloak id
  name: ProjectMemberRoleType
}

export type ProjectMembersAddInput = {
  members?: ProjectMembersAddEntry[]
  owners?: ProjectMembersAddEntry[]
  reviewers?: ProjectMembersAddEntry[]
  member_people_groups?: number[]
}

export type ProjectMembersDeleteInput = {
  name?: string
  user?: string // keycloak id
  member_people_group?: string
}

export type ProjectMemberPeopleGroupOutput = {
  id: number
  description: string
  name: string
}

export type ProjectTeamOutput = {
  members: ProjectMemberOutput[]
  owners: ProjectMemberOutput[]
  reviewers: ProjectMemberOutput[]
  people_groups: ProjectMemberPeopleGroupOutput[]
}

export type ProjectMemberOutput = ProjectMemberModel
