import type { OrganizationModel } from '@/models/organization.model'
import type { TemplateOutput } from '@/models/template.model'
import type { TagModel, TagOutput } from '@/models/tag.model'
import type { Translated } from '@/interfaces/translated'
import type { ImageModel } from '@/models/image.model'
import type BaseModel from '@/models/base.model'

/**
 * @name ProjectCategoryModel
 * @description Category of an organization or project
 */
export interface ProjectCategoryModel extends BaseModel {
  id: number

  name: string
  slug: string
  outdated_slugs?: string[]
  description: string

  background_image: ImageModel | null

  organization: OrganizationModel | OrganizationModel['code']

  is_reviewable: boolean
  order_index: number
  tags: TagModel[]

  only_reviewer_can_publish: boolean
  is_root: boolean
  parent: ProjectCategoryModel | null

  background_color: string
  foreground_color: string

  // extra
  children?: ProjectCategoryModel[]

  projects_count?: number

  hierarchy?: ProjectCategoryModel[]
}

export type TranslatedProjectCategory = Translated<ProjectCategoryModel, 'name' | 'description'>

export type ProjectCategoryCreateInput = Required<Omit<ProjectCategoryModel, 'tags'>> & {
  organization_code: string
  tags?: number[]
}

export type ProjectCategoryPutInput = Required<Omit<ProjectCategoryModel, 'tags'>> & {
  tags: number[]
}

export type ProjectCategoryPatchInput = Partial<Omit<ProjectCategoryModel, 'tags'>> & {
  tags?: number[]
}

export type ProjectCategoryOutput = BaseModel &
  Required<Omit<ProjectCategoryModel, 'tags'>> & {
    template: TemplateOutput
    organization: OrganizationModel['code']
    tags: TagOutput[]
  }

export interface ProjectCategoryBackgroundOutput {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
}
