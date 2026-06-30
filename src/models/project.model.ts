import type {
  ProjectCategoryModel,
  ProjectCategoryOutput,
  TranslatedProjectCategory,
} from '@/models/project-category.model'
import type { LanguageType, ProjectPublicationStatusType, ProjectStatusType } from '@/models/types'
import type { OrganizationModel, OrganizationOutput } from '@/models/organization.model'
import type { TemplateModel, TranslatedTemplate } from '@/models/template.model'
import type { TagModel, TagOutput, TranslatedTag } from '@/models/tag.model'
import type { LocationOutput } from '@/models/location.model'
import type { Translated } from '@/interfaces/translated'
import type { IconImageChoice } from '@/functs/IconImage'
import type { ImageModel } from '@/models/image.model'
import type BaseModel from '@/models/base.model'

/**
 * @name ProjectModel
 * @description Project
 */
export interface ProjectModel extends Omit<BaseModel, 'id'> {
  id: string // Id project are a string
  title: string
  description: string
  header_image: ImageModel
  is_locked: boolean
  is_shareable: boolean
  purpose: string
  categories: ProjectCategoryModel[]
  organizations: OrganizationModel[]
  language: LanguageType
  publication_status: ProjectPublicationStatusType
  life_status: ProjectStatusType
  tags: TagModel[]
  sdgs: number[]
  is_followed: {
    is_followed: boolean
    follow_id: number
  }
  slug: string
  updated_at: string
  created_at: string
  views?: number
  modules: {
    members: number
    groups: number
    linked_projects: number
    similars: number
    locations: number
    comments: number
    goals: number
    blogs: number
    announcements: number
    links: number
    files: number
    reviews: number
    messages: number
    tabs: number
  }
  template?: TemplateModel
}

export type ProjectModulesKeys = keyof ProjectModel['modules']
export type ProjectModuleExtra = ProjectModulesKeys | 'resources'

export const ProjectModuleIcon: { [key in ProjectModuleExtra]: IconImageChoice } = {
  announcements: 'BullhornOutline',
  blogs: 'NewsLine',
  goals: 'TimerLine',
  members: 'Users',
  similars: 'Briefcase',
  locations: 'Map',
  links: 'Paperclip',
  files: 'Globe',
  resources: 'Globe',
  linked_projects: 'LinkRotated',
  comments: 'ChatBubble',
  groups: 'PeopleGroup',
  reviews: 'Feedback',
  messages: 'ChatBubble',
  tabs: 'Tab',
}

export const ProjectModuleTitle: { [key in ProjectModuleExtra]: string } = {
  announcements: 'home.announcements',
  blogs: 'blog.title',
  goals: 'goal.goals',
  members: 'team.team',
  similars: 'project.similars',
  locations: 'project.add-to-project.location',
  files: 'project.files',
  links: 'project.links',

  resources: 'resource.resources',

  linked_projects: 'project.linked-projects',
  comments: 'comment.comments',
  groups: 'project.groups',
  reviews: 'project.reviews',
  messages: 'comment.private-exchange.tab',
  tabs: 'tab.tab.label',
}

export type TranslatedProject = Translated<
  Omit<ProjectModel, 'template' | 'categories' | 'tags'>,
  'title' | 'description' | 'purpose'
> & {
  template?: TranslatedTemplate
  categories: TranslatedProjectCategory[]
  tags: TranslatedTag[]
}

export type ProjectSlugOrId = ProjectModel['id'] | ProjectModel['slug']

export type LinkedProject = {
  id: number
  project: ProjectModel
  target?: ProjectModel
}

export type TranslatedLinkedProject = LinkedProject & {
  project: TranslatedProject
  target?: TranslatedProject
}

export type LinkedProjectRef = {
  project_id: string
  target_id: string
}

export type AddManyLinkedProjectInput = LinkedProjectRef[]

export type RemoveLinkedProjectInput = {
  project_ids: string[]
}

export type ProjectOutput = Required<ProjectModel> & {
  organizations: OrganizationOutput[]
  categories: ProjectCategoryOutput[]
  geolocation_coordinates: LocationOutput
  tags: TagOutput[]
  sdgs: number[]
  images: ImageModel[]
  views: number
  template: TemplateModel
  slug: string
}

export type ProjectHeaderOutput = {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
}

export type ProjectForm = Partial<
  Pick<
    ProjectModel,
    | 'id'
    | 'title'
    | 'purpose'
    | 'language'
    | 'description'
    | 'sdgs'
    | 'is_locked'
    | 'is_shareable'
    | 'publication_status'
    | 'life_status'
    | 'template'
  > & {
    imageSizes: any
    file: ImageModel | File
    organizations_codes: OrganizationModel['code'][]
    categories: TranslatedProjectCategory | ProjectCategoryModel
    categorie: TranslatedProjectCategory
    project_categories_ids: TranslatedProjectCategory['id'][]
    template_id: number
    tags: TranslatedTag[]
  }
>

export type AnyProject = ProjectModel | TranslatedProject

export type QueryFilterProjectSimilars = {
  // required in back
  organizations: OrganizationModel['code'][]
  threshold?: number
}
