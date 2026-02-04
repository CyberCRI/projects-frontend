export type ImageGallery = {
  id: number
  alt?: string
  title?: string
  src: string
}

export type ImageGalleryForm = {
  id?: number
  pictures: File[]
}
