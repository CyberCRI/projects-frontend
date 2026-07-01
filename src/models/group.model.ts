import type { PeopleGroupModel, TranslatedPeopleGroupModel } from '@/models/people-group.model'
import type { UserFromJWTModel, UserModel } from '~/models/user.model'
import type { ProjectSlugOrId } from '~/models/project.model'
import type { Translated } from '~/interfaces/translated'
import type { GroupMemberRoleType } from '~/models/types'

/**
 * @name GroupModel
 * @description Group models
 */

export interface GroupModel {
  id: number
  name: string
  permissions: Array<string>
  users: Array<UserFromJWTModel>
}

export type GroupMember = UserModel & {
  role: GroupMemberRoleType
}

// TODO translted
export type TranslatedGroupMember = Translated<GroupMember, 'job'>

export type HierarchyGroupModel = PeopleGroupModel
export type TrasnlatedHierarchyGroupModel = TranslatedPeopleGroupModel

export interface GroupModelInput {
  user_ids: Array<number>
}

export interface RemoveGroupModelInput {
  users: Array<number>
}

export type AddParentGroupModelInput = {
  name: string
  description: string
  email: string
  type: string
  parent: number
  organization: string
}

export type GroupOuput = Required<GroupModel> & {
  name: string
  description: string
  email: string
  type: string
  organization: string
  managers: any[]
  members: any[]
  hierarchy: any[]
  children: any[]
  projects: any
  header_image: any
  logo_image: any
  publication_status: string // TODO: public | ...
}

export interface PostGroupData {
  name: string
  description: string
  email: string
  type: string
  parent: number
  organization: string
  publication_status: string
}

export type AddGroupMembers = {
  [key in GroupMemberRoleType]: UserModel['id'][]
}
export interface RemoveGroupMember {
  users: UserModel['id'][]
}

export interface PostGroupProjects {
  featured_projects: ProjectSlugOrId[]
}
