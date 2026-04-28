import type { OrganizationModel } from '@/models/organization.model'
import type { TemplateOutput } from '@/models/template.model'
import type { Translated } from '@/interfaces/translated'
import type { ImageModel } from '@/models/image.model'
import type { TagOutput } from '@/models/tag.model'
import type BaseModel from '@/models/base.model'

/**
 * @name ProjectCategoryModel
 * @description Category of an organization or project
 */
export interface ProjectCategoryModel extends BaseModel {
  id: number
  slug?: string
  background_color: string
  background_image: ImageModel
  description: string
  foreground_color: string // Text color
  is_reviewable: boolean
  name: string
  order_index: number
  children: ProjectCategoryOutput[] | number[]
  hierarchy?: ProjectCategoryOutput[] | number[]
  projects_count?: number
}

export type TranslatedProjectCategory = Translated<ProjectCategoryModel, 'name' | 'description'>

export type ProjectCategoryCreateInput = Required<ProjectCategoryModel> & {
  organization_code: string
  tags?: number[]
}

export type ProjectCategoryPutInput = Required<ProjectCategoryModel> & {
  tags: number[]
}

export type ProjectCategoryPatchInput = Partial<ProjectCategoryModel> & {
  tags?: number[]
}

export type ProjectCategoryOutput = BaseModel &
  Required<ProjectCategoryModel> & {
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
