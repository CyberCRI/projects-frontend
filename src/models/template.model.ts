import type { ProjectCategoryModel } from '~/models/project-category.model'
import type { OrganizationModel } from '~/models/organization.model'
import type { ImageModel } from '~/models/image.model'
import type { TagModel } from '~/models/tag.model'
import type { LanguageType } from '~/models/types'
import type BaseModel from '~/models/base.model'

/**
 * @name TemplateModel
 * @description Template of a category
 */
export interface TemplateModel extends BaseModel {
  id: number
  name: string
  description: string
  language: LanguageType
  images: ImageModel[]
  organization: OrganizationModel
  categories: ProjectCategoryModel[]
  project_title: string
  project_description: string
  project_purpose: string
  project_tags: TagModel[]
  blogentry_title: string
  blogentry_content: string
  goal_title: string
  goal_description: string
  review_title: string
  review_description: string
  comment_content: string
}

export type TemplateCreateInput = Required<TemplateModel> & {
  project_categories_ids: number[]
}

export type TemplatePutInput = Required<TemplateCreateInput>

export type TemplatePatchInput = Partial<TemplateCreateInput>

export type TemplateOutput = Required<TemplateModel>
