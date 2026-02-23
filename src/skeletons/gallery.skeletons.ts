import { ImageModel } from '@/models/image.model'

export const imageGallerySkeleton = (def?: Partial<ImageModel>): Omit<ImageModel, 'id'> => {
  const url = ''
  return {
    url,
    name: 'lorem',
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
    ...(def || {}),
  }
}
