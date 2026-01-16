import { ImageSizesFromApi } from '@/functs/imageSizesUtils'
import BaseModel from '@/models/base.model'

/**
 * @name ImageModel
 * @description Image of a project
 */
export type ImageModel = BaseModel &
  ImageSizesFromApi & {
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

export type Image = ImageModel &
  ImageSizesFromApi & {
    variations: {
      full: string
      large: string
      medium: string
      small: string
      original: string
    }
  }

export type ImageOutput = Required<ImageModel>

export type ImageOrganizationOutput = Partial<ImageModel> & {
  gallery: string
}

export type ImageTemplateOutput = Partial<ImageModel>

export type ImageInput = Partial<ImageModel> & {
  project_id: string
}

export type ImageOrganizationInput = Partial<ImageModel> & {
  organization_code: string
}

export type ImageTemplateInput = Partial<ImageModel> & {
  template_id: number
}
