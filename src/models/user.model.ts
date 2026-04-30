/**
 * @name UserModel
 * @description user data set on the project app
 */
import type { PeopleGroupModel, TranslatedPeopleGroupModel } from '~/models/invitation.model'
import type { ImageModel } from '~/models/image.model'

import type { ResearcherLight } from '~/interfaces/researcher'
import type { Translated } from '~/interfaces/translated'

import type BaseModel from '~/models/base.model'
import type { TagModel } from './tag.model'

export type PrivacyValue = 'hide' | 'org' | 'pub'

export type PrivacySettings = {
  publication_status: PrivacyValue
  profile_picture: PrivacyValue
  skills: PrivacyValue
  mobile_phone: PrivacyValue
  email: PrivacyValue
  socials: PrivacyValue
}

export interface UserModel {
  id: number
  name: {
    firstname: string
    lastname: string
  }
  pronouns?: string
  slug: string
  email: string
  roles: string[]
  orgs: string[]
  given_name: string
  family_name: string
  profile_picture?: ImageModel
  permissions: string[]
  description?: string
  short_description?: string
  job?: string
  people_groups?: PeopleGroupModel[] // TODO: define this type
  skills?: UserSkillModel[]
  notifications?: number
  researcher?: ResearcherLight
  resources: {
    files: number
    links: number
  }
  signed_terms_and_conditions?: {
    [key: string]: { version: number | null; date: string | null }
  } | null
  privacy_settings?: PrivacySettings
  sdgs?: number[]
}

export interface UserFromJWTModel {
  id: string
  given_name: string
  family_name: string
  email: string
  groups: string[]
}

export interface NotificationsSettings {
  notify_added_to_project: boolean
  announcement_published: boolean
  followed_project_has_been_edited: boolean
  project_has_been_commented: boolean
  project_has_been_edited: boolean
  project_ready_for_review: boolean
  project_has_been_reviewed: boolean
  comment_received_a_response: boolean
  organization_has_new_access_request: boolean
  invitation_link_will_expire: boolean
  new_instruction: boolean
}

export interface UserPatchModel {
  birthdate?: string
  pronouns?: string
  short_description?: string
  description?: string
  location?: string
  job?: string
  sdgs?: number[]
  facebook?: string
  mobile_phone?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
  language?: string
  email?: string
  given_name?: string
  family_name?: string
  roles_to_add?: number[]
  roles_to_remove?: number[]
  permissions_ids?: number[]
  onboarding_status?: object
  signed_terms_and_conditions?: {
    [key: string]: { version: number | null; date: string | null }
  } | null
}

export interface UserPrivacyPatchModel {
  profile_picture?: PrivacyValue
  profile?: PrivacyValue
  skills?: PrivacyValue
  hobbies?: PrivacyValue
  facebook?: PrivacyValue
  mobile_phone?: PrivacyValue
  linkedin?: PrivacyValue
  medium?: PrivacyValue
  website?: PrivacyValue
  personal_email?: PrivacyValue
  skype?: PrivacyValue
  landline_phone?: PrivacyValue
  twitter?: PrivacyValue
}

export interface UserSkillModel extends BaseModel {
  id: number
  user: string
  tag: TagModel
  level: number
  level_to_reach: number
  category: string
  type: 'skill' | 'hobby'
  can_mentor: boolean
  needs_mentor: boolean
  comment: string
}

export type TranslatedUserModel = Translated<
  Omit<UserModel, 'people_groups'>,
  'description' | 'short_description' | 'job'
> & {
  people_groups: TranslatedPeopleGroupModel[]
}
