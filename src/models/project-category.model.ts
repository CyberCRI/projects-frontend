import BaseModel from '@/models/base.model'
import { OrganizationOutput } from '@/models/organization.model'
import { TemplateOutput } from '@/models/template.model'
import { TagOutput } from '@/models/tag.model'

/**
 * @name ProjectCategoryModel
 * @description Category of an organization or project
 */
export interface ProjectCategoryModel extends BaseModel {
  background_color: string
  background_image: {
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
}

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
