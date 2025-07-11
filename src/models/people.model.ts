/**
 * @name PeopleModel
 * @description user data from people
 */
export interface PeopleModel {
  slug: string
  roles?: Array<string>
  permissions?: Array<string>
  is_superuser?: boolean
  people_groups: Array<object>
  notifications?: number
  privacy_settings?: object
  skills: Array<object>
  id: number
  language: string
  email: string
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
  sdgs: Array<number>
  facebook?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
}

export interface UserPostData {
  email: string
  given_name: string
  family_name: string
  job: string
}
