import type { ImageModel, ImageSize, AttachmentType } from 'shared-projects-frontend/models'
import type { IconImageChoice } from '~/functs/IconImage'
import { mapKeys, pick } from 'es-toolkit'

export const IMAGES_SIZES_DEFAULTS: ImageSize = Object.freeze({
  natural_ratio: 1,
  scale_x: 1,
  scale_y: 1,
  left: 0,
  top: 0,
})

export const pictureApiToImageSizes = <T extends ImageSize>(image: T | null): ImageSize | null => {
  if (!image) {
    return null
  }
  return {
    ...IMAGES_SIZES_DEFAULTS,
    ...pick(image, ['left', 'top', 'scale_x', 'scale_y', 'natural_ratio']),
  }
}

export const imageSizesFormData = <T extends ImageSize>(
  formData: FormData,
  imageSizes: T | null = null
) => {
  const safeImageSize = {
    ...IMAGES_SIZES_DEFAULTS,
    ...(imageSizes || {}),
  }
  Object.entries(safeImageSize).forEach(([key, value]) => {
    formData.set(key, value.toString())
  })
}

// TODO: remove this
// temporary pseudo duplicate (only key prefix change)
// to accomodate API change for post user
// while patch keep old behavior
export const imageSizesFormDataPost = <T extends ImageSize>(
  formData: FormData,
  imageSizes: T | null = null
) => {
  const safeImageSize = {
    ...IMAGES_SIZES_DEFAULTS,
    ...(imageSizes || {}),
  }

  // add prefix for users
  const objs = mapKeys(safeImageSize, (key) => `profile_picture_${key}`)

  Object.entries(objs).forEach(([key, value]) => {
    formData.set(key, value.toString())
  })
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
    ...IMAGES_SIZES_DEFAULTS,
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
export const fileToImageModel = (file: File | Blob): ImageModel => {
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
