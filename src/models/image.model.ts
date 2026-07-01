import type BaseModel from '~/models/base.model'

export interface ImageSize {
  scale_x: number | null
  scale_y: number | null
  left: number | null
  top: number | null
  natural_ratio: number | null
}

/**
 * @name ImageModel
 * @description Image of a project
 */
export type ImageModel = BaseModel &
  ImageSize & {
    id?: number
    url: string
    file: string
    name: string
    height?: number
    width?: number
    variations: {
      full: string
      large: string
      medium: string
      original: string
      small: string
    }
  }
export type ImageVariations = keyof ImageModel['variations']

// when created return static_url
export type ImageModealCreated = ImageModel & {
  static_url: string
}

export type ImageInput = Partial<ImageModel> & {
  project_id: string
}

export type ImageOrganizationInput = Partial<ImageModel> & {
  organization_code: string
}

export type ImageTemplateInput = Partial<ImageModel> & {
  template_id: number
}
