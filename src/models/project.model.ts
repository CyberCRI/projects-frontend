import BaseModel from '@/models/base.model'
import { LanguageType, ProjectPublicationStatusType, ProjectStatusType } from '@/models/types'
import { ProjectTeamOutput } from '@/models/project-member.model'
import { ProjectCategoryOutput } from '@/models/project-category.model'
import { LocationOutput } from '@/models/location.model'
import { SdgOutput } from '@/models/sdg.model'
import { GoalOutput } from '@/models/goal.model'
import { AttachmentLinkOutput } from '@/models/attachment-link.model'
import { AttachmentFileOutput } from '@/models/attachment-file.model'
import { ImageModel, ImageOutput } from '@/models/image.model'
import { CommentOutput } from '@/models/comment.model'
import { BlogEntryOutput } from '@/models/blog-entry.model'
import { OrganizationModel, OrganizationOutput } from '@/models/organization.model'
import { ReviewModel } from '@/models/review.model'
import { AnnouncementModel, AnnouncementOutput } from '@/models/announcement.model'
import { FollowOutput } from '@/models/follow.model'
import { TemplateModel } from '@/models/template.model'
import { TagModel, TagOutput } from '@/models/tag.model'
import { Translated } from '@/interfaces/translated'
import { IconImageChoice } from '@/functs/IconImage'

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
  categories: ProjectCategoryOutput[]
  organizations: OrganizationModel[]
  language: LanguageType
  locations: LocationOutput[]
  publication_status: ProjectPublicationStatusType
  life_status: ProjectStatusType
  reviews: ReviewModel[]
  tags: TagModel[]
  sdgs: number[]
  is_followed: {
    is_followed: boolean
    follow_id: number
  }
  follows: FollowOutput[]
  links: AttachmentLinkOutput[]
  files: AttachmentFileOutput[]
  announcements: AnnouncementOutput[]
  blog_entries: BlogEntryOutput[]
  goals: GoalOutput[]
  slug: string
  updated_at: string
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
  }
}

export type ProjectModulesKeys = keyof ProjectModel['modules']

export const ProjectModuleIcon: { [key in ProjectModulesKeys]: IconImageChoice } = {
  announcements: 'BullhornOutline',
  blogs: 'Progress5',
  goals: 'TimerLine',
  members: 'Users',
  similars: 'PeopleGroup',
  locations: 'Map',
  links: 'Paperclip',
  files: 'Globe',
  linked_projects: 'LinkRotated',
  comments: 'ChatBubble',
  groups: 'Briefcase',
  reviews: 'Alert',
}

export const ProjectModuleTitle: { [key in ProjectModulesKeys]: string } = {
  announcements: 'home.announcements',
  blogs: 'blog.title',
  goals: 'goal.goals',
  members: 'team.team',
  similars: 'project.similars',
  locations: 'project.add-to-project.location',
  files: 'project.files',
  links: 'project.links',
  linked_projects: 'project.linked-projects',
  comments: 'comment.comments',
  groups: 'project,groups',
  reviews: 'project.reviews',
}

export type TranslatedProject = Translated<ProjectModel, 'title' | 'description' | 'purpose'>

export type ProjectSlugOrId = ProjectModel['id'] | ProjectModel['slug']

export type ProjectCreateInput = Required<ProjectModel> & {
  project_categories_ids: number
  tags?: number[]
  sdgs?: number[]
}

export type ProjectPutInput = Required<ProjectCreateInput>

export type ProjectPatchInput = Partial<ProjectCreateInput>

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

export type AddLinkedProjectInput = {
  projects: LinkedProjectRef
}

export type AddManyLinkedProjectInput = {
  projects: LinkedProjectRef[]
}

export type RemoveLinkedProjectInput = {
  project_ids: string[]
}

export type ProjectOutput = Required<ProjectModel> & {
  team: ProjectTeamOutput
  organizations: OrganizationOutput[]
  categories: ProjectCategoryOutput[]
  geolocation_coordinates: LocationOutput
  tags: TagOutput[]
  sdgs: SdgOutput[]
  goals: GoalOutput[]
  links: AttachmentLinkOutput[]
  files: AttachmentFileOutput[]
  linked_projects: LinkedProject[]
  images: ImageOutput[]
  comments: CommentOutput[]
  blog_entries: BlogEntryOutput[]
  announcements: AnnouncementModel[]
  views: number
  template: TemplateModel
  follows: FollowOutput[]
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
