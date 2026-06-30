import type { ProjectGroupRoleType, ProjectMemberRoleType, ProjectStatusType } from '@/models/types'
import type { ProjectModel, ProjectModulesKeys } from '~/models/project.model'
import type { TranslatedUserModel, UserModel } from '@/models/user.model'
import type { PeopleGroupIdOrSlug } from '~/models/invitation.model'
import type { Ordering } from '@/interfaces/query'
import type BaseModel from '@/models/base.model'

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

export type TranslatedProjectMember = TranslatedUserModel & Pick<ProjectMemberModel, 'role'>

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
  users?: number[] // keycloak id
  people_groups?: PeopleGroupIdOrSlug[]
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

export type QueryFilterProject = Partial<
  {
    ordering: Ordering<'created_at' | 'updated_at'>
    member_role: ProjectMemberRoleType[]
    group_role: ProjectGroupRoleType[]
    life_status: ProjectStatusType[]
    creation_year: string[]
    ids: ProjectModel['id'][]
    modules: 'none' | ProjectModulesKeys[]
    serializer: 'light' | 'superlight'
  } & PaginationQuery
>

export type QueryFilterProjectMembers = Partial<
  {
    ordering: Ordering<'role'>
    role: ProjectMemberRoleType
  } & PaginationQuery
>
