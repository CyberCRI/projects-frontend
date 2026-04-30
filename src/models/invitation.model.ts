import type { BaseLocationModel, BaseTranslatedLocationModel } from '~/models/location.model'
import type { OrganizationModel } from '~/models/organization.model'
import type { TagModel } from '~/models/tag.model'
import type { Image } from '~/models/image.model'

import type { Translated } from '~/interfaces/translated'

import type { IconImageChoice } from '~/functs/IconImage'

export type SubGroup = {
  id: number
  name: string
}

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
  children: PeopleGroupModel[]
  hierarchy: any
  sdgs: number[]
  tags: TagModel[]
  locations: BaseLocationModel[]
  modules: {
    members: number
    featured_projects: number
    publications: number
    conferences: number
    similars: number
    subgroups: number
    gallery: number
    locations: number
    news: number
    event: number
  }
}

export type PeopleGroupIdOrSlug = PeopleGroupModel['id'] | PeopleGroupModel['slug']

export type PeopleGroupModulesKeys = keyof PeopleGroupModel['modules']

export type TranslatedPeopleGroupModel = Omit<
  Translated<PeopleGroupModel, 'name' | 'description' | 'short_description'>,
  'locations'
> & {
  locations: BaseTranslatedLocationModel[]
}

export type GeneralLocationPeopleGroup = BaseTranslatedLocationModel & {
  people_group: TranslatedPeopleGroupModel
}

export const GroupModuleIcon: { [key in PeopleGroupModulesKeys]: IconImageChoice } = {
  conferences: 'Article',
  featured_projects: 'Briefcase',
  publications: 'Article',
  members: 'Users',
  similars: 'PeopleGroup',
  subgroups: 'nodeTree',
  locations: 'Map',
  gallery: 'Gallery',
  news: 'NewsLine',
  event: 'Calendar',
}

export const GroupModuleTitle: { [key in PeopleGroupModulesKeys]: string } = {
  conferences: 'group.conferences',
  featured_projects: 'group.projects',
  publications: 'group.publications',
  members: 'group.members',
  similars: 'group.similars',
  subgroups: 'group.subgroups',
  locations: 'group.locations',
  gallery: 'gallery.pictures',
  news: 'group.news',
  event: 'group.event',
}

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
  expire_at: string
}

export interface InvitationModelInput {
  people_group_id: number
  description: string
  expire_at: string
}
