import { Translated } from '@/interfaces/translated'
import { Image } from '@/models/image.model'
import { OrganizationModel } from '@/models/organization.model'

// TODO remove once merged with group PR
export interface PeopleGroupModel {
  id: number
  slug: string
  name: string
  description: string
  short_description: string
  email: string
  type: string
  header_image: Image
  publication_status: string
  organization: OrganizationModel
  children: any[]
  hierarchy: any
  modules: {
    members: number
    featured_projects: number
    publications: number
    conferences: number
  }
}

export type TranslatedPeopleGroupModel = Translated<
  PeopleGroupModel,
  'name' | 'description' | 'short_description'
>

export interface ProfilePictureVariationsModel {
  full: string
  large: string
  medium: string
  small: string
  original: string
}
export interface ProfilePictureModel {
  id: number
  name: string
  url: string
  height: number
  width: number
  natural_ratio: number | null
  scale_x: number | null
  scale_y: number | null
  left: number | null
  top: number | null
  created_at: string
  variations: ProfilePictureVariationsModel
}
export default interface InvitationUserModel {
  owner: {
    id: number
    given_name: string
    email: string
    family_name: string
    pronouns: string
    job: string
    profile_picture: ProfilePictureModel
    current_org_role: string | null
  }
}

/**
 * @name InvitationModel
 * @description Invitation models
 */
export interface InvitationModel {
  token: string
  created_at: string
  people_group: PeopleGroupModel
  id: number
  organization: string
  description: string
  ownner: InvitationUserModel
  expire_at: Date
}

export interface InvitationModelInput {
  people_group_id: number
  description: string
  expire_at: string
}
