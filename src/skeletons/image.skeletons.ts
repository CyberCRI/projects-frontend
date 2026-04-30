import { urlToImageModel } from '~/functs/imageSizesUtils'
import type { ImageModel } from '~/models/image.model'

export const imageSkeletons = (): ImageModel => ({
  ...urlToImageModel(usePatatoid(1)),
})
