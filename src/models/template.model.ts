import BaseModel from '@/models/base.model'
import { ImageModel } from '@/models/image.model'

/**
 * @name TemplateModel
 * @description Template of a category
 */
export interface TemplateModel extends BaseModel {
  project_title: string
  goal_placeholder: string
  project_description: string
  blogentry_placeholder: string
  images: ImageModel[]
}

export type TemplateCreateInput = Required<TemplateModel> & {
  project_categories_ids: number[]
}

export type TemplatePutInput = Required<TemplateCreateInput>

export type TemplatePatchInput = Partial<TemplateCreateInput>

export type TemplateOutput = Required<TemplateModel>
