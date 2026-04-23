import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { ImageModel } from '@/models/image.model'
import { OrganizationModel } from '@/models/organization.model'
import { ProjectCategoryModel } from '@/models/project-category.model'
import { Language } from '@/models/types'

/**
 * @name TemplateModel
 * @description Template of a category
 */
export interface TemplateModel extends BaseModel {
  id: number
  name: string
  description: string
  language: Language
  images: ImageModel[]
  organization: OrganizationModel
  categories: ProjectCategoryModel[]

  project_title: string
  project_description: string
  project_purpose: string
  project_tags: string
  blogentry_title: string
  blogentry_content: string
  goal_title: string
  goal_description: string
  review_title: string
  review_description: string
  comment_content: string
}

export type TranslatedTemplate = Translated<
  TemplateModel,
  | 'name'
  | 'description'
  | 'project_title'
  | 'project_description'
  | 'project_purpose'
  | 'project_tags'
  | 'blogentry_title'
  | 'blogentry_content'
  | 'goal_title'
  | 'goal_description'
  | 'review_title'
  | 'review_description'
  | 'comment_content'
>

export type TemplateCreateInput = Required<TemplateModel> & {
  project_categories_ids: number[]
}

export type TemplatePutInput = Required<TemplateCreateInput>

export type TemplatePatchInput = Partial<TemplateCreateInput>

export type TemplateOutput = Required<TemplateModel>
