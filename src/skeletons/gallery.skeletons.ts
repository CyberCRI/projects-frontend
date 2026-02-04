import { ImageGallery } from '@/interfaces/gallery'

export const imageGallerySkeleton = (): Omit<ImageGallery, 'id'> => {
  return {
    alt: 'lorem',
    src: '',
  }
}
