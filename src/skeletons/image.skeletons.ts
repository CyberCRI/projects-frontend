import type { ImageModel } from 'shared-projects-frontend/models/image.model'
import { urlToImageModel } from '~/functs/imageSizesUtils'

export const imageSkeletons = (): ImageModel => ({
  ...urlToImageModel(usePatatoid(1)),
})
