import { ImageModel } from '@/models/image.model'

export type ImageSizes = {
  scaleX: number
  scaleY: number
  left: number
  top: number
  naturalRatio: number
} | null

export interface ImageSizesFromApi {
  scale_x: number | null
  scale_y: number | null
  left: number | null
  top: number | null
  natural_ratio: number | null
}

export function pictureApiToImageSizes(pictureApiData: ImageSizesFromApi | null): ImageSizes {
  return pictureApiData &&
    ['scale_x', 'scale_y', 'left', 'top', 'natural_ratio'].reduce(
      (acc, key) => acc && typeof pictureApiData[key] === 'number',
      true
    ) &&
    ['scale_x', 'scale_y', 'natural_ratio'].reduce(
      // null scale or ratio mean a null image size
      (acc, key) => acc && pictureApiData[key] != 0,
      true
    )
    ? {
        scaleX: pictureApiData.scale_x,
        scaleY: pictureApiData.scale_y,
        left: pictureApiData.left,
        top: pictureApiData.top,
        naturalRatio: pictureApiData.natural_ratio,
      }
    : null
}

export function imageSizesToPictureApi(imagesSizes: ImageSizes): ImageSizesFromApi {
  return imagesSizes
    ? {
        scale_x: imagesSizes.scaleX,
        scale_y: imagesSizes.scaleY,
        left: imagesSizes.left,
        top: imagesSizes.top,
        natural_ratio: imagesSizes.naturalRatio,
      }
    : {
        scale_x: null, // for json null is ok, if we swicth to formdata, we'll use 0
        scale_y: null,
        left: null,
        top: null,
        natural_ratio: null,
      }
}

function _imageSizesFormData(formData: FormData, imageSizes: ImageSizes, keyMap: object): void {
  if (!imageSizes) return
  for (const [source, target] of Object.entries(keyMap)) {
    const value = imageSizes[source]
    if (typeof value == 'number') formData.append(target, String(value))
    else formData.append(target, '0') // null scale or ratio mean a null image size
  }
}

export function imageSizesFormData(formData: FormData, imageSizes: ImageSizes): void {
  const keyMap = {
    scaleX: 'scale_x',
    scaleY: 'scale_y',
    left: 'left',
    top: 'top',
    naturalRatio: 'natural_ratio',
  }
  _imageSizesFormData(formData, imageSizes, keyMap)
}

// TODO:
// temporary pseudo duplicate (only key prefix change)
// to accomodate API change for post user
// while patch keep old behavior
export function imageSizesFormDataPost(formData: FormData, imageSizes: ImageSizes): void {
  const keyMap = {
    scaleX: 'profile_picture_scale_x',
    scaleY: 'profile_picture_scale_y',
    left: 'profile_picture_left',
    top: 'profile_picture_top',
    naturalRatio: 'profile_picture_natural_ratio',
  }
  _imageSizesFormData(formData, imageSizes, keyMap)
}

/**
 * convert url object to imageModel
 *
 * @function
 * @name urlToImageModel
 * @kind variable
 * @param {File} file
 * @returns {ImageModel}
 * @exports
 */
export const urlToImageModel = (url: string): ImageModel => {
  return {
    url,
    name: '',
    file: null,
    variations: {
      large: url,
      full: url,
      medium: url,
      small: url,
      original: url,
    },
    scale_x: 0,
    scale_y: 0,
    left: 0,
    top: 0,
    natural_ratio: 0,
  }
}

/**
 * convert file object (from input) to imageModel
 *
 * @function
 * @name fileToImageModel
 * @kind variable
 * @param {File} file
 * @returns {ImageModel}
 * @exports
 */
export const fileToImageModel = (file: File): ImageModel => {
  const url = URL.createObjectURL(file)
  return urlToImageModel(url)
}
