import type { LanguageType, ProjectPublicationStatusType, ProjectStatusType } from '@/models/types'
import type { OrganizationModel, OrganizationOutput } from '@/models/organization.model'
import type { AnnouncementModel, AnnouncementOutput } from '@/models/announcement.model'
import type { TemplateModel, TranslatedTemplate } from '@/models/template.model'
import type { ProjectCategoryOutput } from '@/models/project-category.model'
import type { AttachmentLinkOutput } from '@/models/attachment-link.model'
import type { AttachmentFileOutput } from '@/models/attachment-file.model'
import type { ProjectTeamOutput } from '@/models/project-member.model'
import type { ImageModel, ImageOutput } from '@/models/image.model'
import type { BlogEntryOutput } from '@/models/blog-entry.model'
import type { LocationOutput } from '@/models/location.model'
import type { TagModel, TagOutput } from '@/models/tag.model'
import type { CommentOutput } from '@/models/comment.model'
import type { Translated } from '@/interfaces/translated'
import type { FollowOutput } from '@/models/follow.model'
import type { ReviewModel } from '@/models/review.model'
import type { GoalOutput } from '@/models/goal.model'
import type { SdgOutput } from '@/models/sdg.model'
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
  organizations: OrganizationModel[]
  language: LanguageType
  locations: LocationOutput[]
  publication_status: ProjectPublicationStatusType
  life_status: ProjectStatusType
  reviews: ReviewModel[]
  tags: TagModel[]
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
  template?: TemplateModel
}

export type TranslatedProject = Translated<
  Omit<ProjectModel, 'template'>,
  'title' | 'description' | 'purpose'
> & {
  template?: TranslatedTemplate
}

export type ProjectCreateInput = Required<ProjectModel> & {
  project_categories_ids: number
  tags?: number[]
  sdgs?: number[]
}

export type ProjectPutInput = Required<ProjectCreateInput>

export type ProjectPatchInput = Partial<ProjectCreateInput>

export type LinkedProject = {
  id: number
  project: ProjectOutput
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
