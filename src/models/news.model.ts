import BaseModel from '@/models/base.model'

/**
 * @name NewsModel
 * @description News of an organization
 */
export interface NewsModel extends BaseModel {
  id: number
  title: string
  content: string
  images: NewsImageModel[]
}

export interface NewsImageModel {
  file: string
  name: string
  gallery: string
}

export type NewsOutput = BaseModel &
  Required<NewsModel> & {
    images?: Array<NewsImageModel>
  }

export type NewsInput = Required<NewsModel> & {
  organization_code: string
}

export interface HeaderImage {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
  variations: {
    full: string
    large: string
    medium: string
    original: string
    small: string
  }
}

export type NewsHeaderOutput = {
  id: number
  name: string
  url: string
  height: number
  width: number
  created_at: Date
}
