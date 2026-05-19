import type {
  PeopleGroupIdOrSlug,
  PeopleGroupModel,
  PeopleGroupModulesKeys,
  TranslatedPeopleGroupModel,
} from '~/models/invitation.model'
import type {
  ProjectModel,
  ProjectModulesKeys,
  ProjectSlugOrId,
  TranslatedProject,
} from '~/models/project.model'
import type { ProjectCategoryModel } from '~/models/project-category.model'
import type { TranslatedUserModel, UserModel } from '~/models/user.model'
import type { OrganizationModel } from '~/models/organization.model'
import type { Language, SearchObjectType } from '~/models/types'
import type { SkillModel } from '~/models/skill.model'
import type { TagModel } from '~/models/tag.model'
import type { Ordering } from '~/interfaces/query'
import type BaseModel from '~/models/base.model'

export interface BaseSearchResult extends BaseModel {
  id: number
  type: SearchObjectType
  project: ProjectModel | null
  user: UserModel | null
  people_group: PeopleGroupModel | null
  last_update: string
}

export interface SearchResultProject extends BaseSearchResult {
  type: 'project'
  project: ProjectModel
  user: null
  people_group: null
}
export type TranslatedSearchResultProject = Omit<SearchResultProject, 'project'> & {
  project: TranslatedProject
}

export interface SearchResultUser extends BaseSearchResult {
  type: 'user'
  project: null
  user: UserModel
  people_group: null
}
export type TranslatedSearchResultUser = Omit<SearchResultUser, 'user'> & {
  user: TranslatedUserModel
}

export interface SearchResultGroup extends BaseSearchResult {
  type: 'people_group'
  project: null
  user: null
  people_group: PeopleGroupModel
}
export type TranslatedSearchResultGroup = Omit<SearchResultGroup, 'people_group'> & {
  people_group: TranslatedPeopleGroupModel
}

export type SearchResultAll = SearchResultProject | SearchResultUser | SearchResultGroup

export type TranslatedSearchResultAll =
  | TranslatedSearchResultProject
  | TranslatedSearchResultUser
  | TranslatedSearchResultGroup

export type QueryFilterSearch = Partial<
  {
    // order
    ordering: Ordering<'type' | 'last_update'>
    // search options
    types: ('user' | 'project' | 'people_group')[]
    fuzziness: number
    search_type: string

    // filters
    organizations: OrganizationModel['code'][]
    sdgs: number[]
    skills: SkillModel['tag']['id'][]
    can_mentor: boolean
    needs_mentor: boolean
    can_mentor_on: SkillModel['tag']['id'][]
    needs_mentor_on: SkillModel['tag']['id'][]
    languages: Language[]
    categories: ProjectCategoryModel['id'][]
    members: UserModel['id'][]
    tags: TagModel['id'][]

    projects: ProjectSlugOrId[]
    people_group: PeopleGroupIdOrSlug[]

    modules: 'none' | ProjectModulesKeys[] | PeopleGroupModulesKeys[]
  } & PaginationQuery
>
