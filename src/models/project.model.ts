import BaseModel from '@/models/base.model'
import { LanguageType, ProjectPublicationStatusType, ProjectStatusType } from '@/models/types'
import { ProjectTeamOutput } from '@/models/project-member.model'
import { ProjectCategoryOutput } from '@/models/project-category.model'
import { LocationOutput } from '@/models/location.model'
import { SdgOutput } from '@/models/sdg.model'
import { GoalOutput } from '@/models/goal.model'
import { AttachmentLinkOutput } from '@/models/attachment-link.model'
import { AttachmentFileOutput } from '@/models/attachment-file.model'
import { ImageOutput } from '@/models/image.model'
import { CommentOutput } from '@/models/comment.model'
import { BlogEntryOutput } from '@/models/blog-entry.model'
import { OrganizationOutput } from '@/models/organization.model'
import { ReviewModel } from '@/models/review.model'
import { AnnouncementModel, AnnouncementOutput } from '@/models/announcement.model'
import { FollowOutput } from '@/models/follow.model'
import { TemplateModel } from '@/models/template.model'
import { TagModel, TagOutput } from '@/models/tag.model'

interface HeaderImage {
    id: Number
    name: String
    url: String
    height: Number
    width: Number
    created_at: Date
    variations: {
        full: string
        large: string
        medium: string
        original: string
        small: string
    }
}

/**
 * @name ProjectModel
 * @description Project
 */
export interface ProjectModel extends Omit<BaseModel, 'id'> {
    id: string // Id project are a string
    title: string
    description: string
    header_image: HeaderImage
    is_locked: boolean
    is_shareable: boolean
    purpose: string
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
}

export type ProjectCreateInput = Required<ProjectModel> & {
    project_categories_ids: number
    tags?: number[]
    sdgs_ids?: number[]
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
