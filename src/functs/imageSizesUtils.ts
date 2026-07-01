import type { ImageModel, ImageSize } from '~/models/image.model'
import type { IconImageChoice } from '~/functs/IconImage'
import type { AttachmentType } from '~/models/types'

export type ImageSizeConverted = {
  scaleX: number
  scaleY: number
  left: number
  top: number
  naturalRatio: number
} | null

export function pictureApiToImageSizes(pictureApiData: ImageSize | null): ImageSizeConverted {
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

export const IMAGES_SIZES_DEFAULTS: ImageSizeConverted = Object.freeze({
  naturalRatio: 1,
  scaleX: 1,
  scaleY: 1,
  left: 0,
  top: 0,
})

export function imageSizesToPictureApi(imagesSizes: ImageSizeConverted): ImageSize {
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

function _imageSizesFormData(
  formData: FormData,
  imageSizes: ImageSizeConverted,
  keyMap: object
): void {
  if (!imageSizes) return
  for (const [source, target] of Object.entries(keyMap)) {
    const value = imageSizes[source]
    if (typeof value == 'number') formData.append(target, String(value))
    else formData.append(target, '0') // null scale or ratio mean a null image size
  }
}

export function imageSizesFormData(formData: FormData, imageSizes: ImageSizeConverted): void {
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
export function imageSizesFormDataPost(
  formData: FormData,
  imageSizes: ImageSizeConverted = null
): void {
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

/**
 * mimeType can be a mimeType 'application/pdf', 'image/png' or url 'https://linkeding.com ...ect
 *
 * @function
 * @name mimeTypeToInfo
 * @kind variable
 * @param {string} mimeType
 * @returns {{ icon: "Account" | "Alert" | "AlertOutline" | "Archive" | "ArrowLeft" | "ArrowRight" | "ArrowUpRightFromSquare" | "Article" | "Ban" | "BarsStaggered" | "Bell" | "BookmarkBoxOutline" | "BookmarkFill" | "BookmarkLine" | "Briefcase" | "Bug" | "BullhornOutline" | "Calendar" | "Cancel" | "ChartBox" | "ChatBubble" | "Check" | "CheckBoxBlankOutline" | "CheckBoxChecked" | "CheckBoxOutline" | "ChevronDown" | "ChevronLeft" | "ChevronRight" | "ChevronUp" | "Circle" | "CircleOutline" | "Close" | "CloseCircle" | "Cog" | "Copy" | ... 76 more ... | "Video"; color?: string; }}
 * @exports
 */
export const mimeTypeToInfo = (
  mimeType: string | null
): { icon: IconImageChoice; color?: string } => {
  mimeType ??= ''
  if (mimeType.startsWith('image/')) {
    return {
      icon: 'Gallery',
      color: 'blue',
    }
  }
  if (mimeType.startsWith('text/')) {
    return {
      icon: 'FileText',
    }
  }

  if (mimeType.startsWith('application/pdf')) {
    return {
      icon: 'FilePdf',
      color: 'red',
    }
  }

  if (mimeType.startsWith('application/')) {
    return { icon: 'Archive', color: 'red' }
  }

  if (mimeType.startsWith('audio/')) {
    return { icon: 'Audio', color: 'yellow' }
  }

  if (mimeType.startsWith('video/')) {
    return { icon: 'Video', color: 'violet' }
  }

  return { icon: 'File' }
}

/**
 * convert attachment type from link to mimetype
 *
 * @function
 * @name getMimeFromType
 * @kind variable
 * @param {AttachmentType} type
 * @returns {string}
 * @exports
 */
export const getMimeFromType = (type: AttachmentType): string => {
  switch (type) {
    case 'image':
      return 'image/unknow'
    case 'video':
      return 'video/unknow'
    case 'file':
      return
  }
}
