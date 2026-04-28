import type { PeopleGroupModel, TranslatedPeopleGroupModel } from '~/models/invitation.model'

import type { Translated } from '~/interfaces/translated'

/**
 * @name PeopleModel
 * @description user data from people
 */
export interface PeopleModel {
  slug: string
  roles?: Array<string>
  permissions?: Array<string>
  is_superuser?: boolean
  current_org_role: string
  people_groups: PeopleGroupModel[]
  notifications?: number
  privacy_settings?: object
  skills: Array<object>
  id: number
  language: string
  email: string
  email_verified: boolean
  given_name: string
  family_name: string
  birthday?: any
  pronouns?: string
  short_description?: string
  description?: string
  location?: string
  job: string // Job title
  mobile_phone?: string
  personnal_email: string
  sdgs: number[]
  facebook?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
  created_at?: string
}

export type TranslatedPeopleModel = Translated<
  PeopleModel,
  'description' | 'short_description' | 'job'
> & {
  people_groups: TranslatedPeopleGroupModel
}

export interface UserPostData {
  email: string
  given_name: string
  family_name: string
  job: string
}
