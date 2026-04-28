import type { ImageModel } from '~/models/image.model'
import type BaseModel from '~/models/base.model'

/**
 * @name TemplateModel
 * @description Template of a category
 */
export interface TemplateModel extends BaseModel {
  id: number
  project_title: string
  goal_title: string
  project_description: string
  blogentry_title: string
  images: ImageModel[]
}

export type TemplateCreateInput = Required<TemplateModel> & {
  project_categories_ids: number[]
}

export type TemplatePutInput = Required<TemplateCreateInput>

export type TemplatePatchInput = Partial<TemplateCreateInput>

export type TemplateOutput = Required<TemplateModel>
