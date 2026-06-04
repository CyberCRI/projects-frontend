import type BaseModel from '~/models/base.model'

import type { ImageSizesFromApi } from '~/functs/imageSizesUtils'

/**
 * @name ImageModel
 * @description Image of a project
 */
export type ImageModel = BaseModel &
  ImageSizesFromApi & {
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
// when created return static_url
export type ImageModealCreated = ImageModel & {
  static_url: string
}

export type ImageVariations = keyof ImageModel['variations']

export type ImageOrganizationOutput = Partial<ImageModel> & {
  gallery: string
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
