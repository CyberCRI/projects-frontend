import type { BaseLocationModel, BaseTranslatedLocationModel } from '~/models/location.model'
import type { OrganizationModel } from '~/models/organization.model'
import type { Translated } from '~/interfaces/translated'
import type { IconImageChoice } from '~/functs/IconImage'
import type { ImageModel } from '~/models/image.model'
import type { GroupDataRole } from '~/models/types'
import type { TagModel } from '~/models/tag.model'

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
  role?: GroupDataRole
  header_image: ImageModel
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

export type QueryFilterGroup = Partial<{
  modules: PeopleGroupModulesKeys[] | 'none'
  serializer: 'light' | 'superlight'
}>

export type QueryFilterGroupHierarchy = QueryFilterGroup &
  Partial<{
    depth: number
    parent: PeopleGroupIdOrSlug
  }>
