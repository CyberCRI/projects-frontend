type ImageSizes = {
  scaleX: number
  scaleY: number
  left: number
  top: number
  naturalRatio: number
} | null

interface ImageSizesFromApi {
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

export function imageSizesFormData(formData: FormData, imageSizes: ImageSizes): void {
  formData.append(
    'scale_x',
    imageSizes && typeof imageSizes.scaleX == 'number' ? String(imageSizes.scaleX) : ''
  )
  formData.append(
    'scale_y',
    imageSizes && typeof imageSizes.scaleY == 'number' ? String(imageSizes.scaleY) : ''
  )
  formData.append(
    'left',
    imageSizes && typeof imageSizes.left == 'number' ? String(imageSizes.left) : ''
  )
  formData.append(
    'top',
    imageSizes && typeof imageSizes.top == 'number' ? String(imageSizes.top) : ''
  )
  formData.append(
    'natural_ratio',
    imageSizes && typeof imageSizes.naturalRatio == 'number' ? String(imageSizes.naturalRatio) : ''
  )
}

// TODO:
// temporary pseudo duplicate (only key prefix change)
// to accomodate API change for post user
// while patch keep old behavior
export function imageSizesFormDataPost(formData: FormData, imageSizes: ImageSizes): void {
  // null scale or ratio mean a null image size
  formData.append(
    'profile_picture_scale_x',
    imageSizes && typeof imageSizes.scaleX == 'number' ? String(imageSizes.scaleX) : '0'
  )
  formData.append(
    'profile_picture_scale_y',
    imageSizes && typeof imageSizes.scaleY == 'number' ? String(imageSizes.scaleY) : '0'
  )
  formData.append(
    'profile_picture_left',
    imageSizes && typeof imageSizes.left == 'number' ? String(imageSizes.left) : '0'
  )
  formData.append(
    'profile_picture_top',
    imageSizes && typeof imageSizes.top == 'number' ? String(imageSizes.top) : '0'
  )
  formData.append(
    'profile_picture_natural_ratio',
    imageSizes && typeof imageSizes.naturalRatio == 'number' ? String(imageSizes.naturalRatio) : '0'
  )
}
