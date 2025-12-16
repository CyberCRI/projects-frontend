import { UserFromJWTModel, UserModel } from '@/models/user.model'

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
  is_manager: boolean
}

export interface HierarchyGroupModel {
  id: number
  name: string
  children: Array<HierarchyGroupModel>
}

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

export interface AddGroupMembers {
  leaders: Array<string>
  managers: Array<string>
  members: Array<string>
}

export type GroupRole = 'leaders' | 'managers' | 'members'

export interface RemoveGroupMember {
  name: GroupRole
  user: string
}

export interface PostGroupProjects {
  featured_projects: Array<string>
}

export interface RemoveGroupProject {
  project: string
}
