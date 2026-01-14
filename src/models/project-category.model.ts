import BaseModel from '@/models/base.model'
import { OrganizationOutput } from '@/models/organization.model'
import { TemplateOutput } from '@/models/template.model'
import { TagOutput } from '@/models/tag.model'
import { ImageModel } from '@/models/image.model'
import { Translated } from '@/interfaces/translated'

/**
 * @name ProjectCategoryModel
 * @description Category of an organization or project
 */
export interface ProjectCategoryModel extends BaseModel {
  id: number
  slug?: string
  background_color: string
  background_image: ImageModel & {
    scale_x: number
    scale_y: number
    left: number
    top: number
    natural_ratio: number
    variations: {
      full: string
      large: string
      medium: string
      original: string
      small: string
    }
  }
  description: string
  foreground_color: string // Text color
  is_reviewable: string
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
    organization: OrganizationOutput
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
