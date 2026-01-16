import BaseModel from '@/models/base.model'

/**
 * @name TagModel
 * @description Tag of an organization or project or project-category
 */
export interface TagModel extends BaseModel {
  id: number
  title: string
  title_en: string
  title_fr: string
  organization?: string
  type?: string
  secondary_type?: string
  description: string
  description_en: string
  description_fr: string
}

export type TagCreateInput = Required<TagModel>

export type TagPutInput = Required<TagModel>

export type TagPatchInput = Partial<TagModel>

export type TagOutput = Required<TagModel>
