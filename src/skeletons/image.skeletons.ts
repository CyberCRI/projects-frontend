import { urlToImageModel } from '~/functs/imageSizesUtils'
import type { ImageModel } from 'shared-projects-frontend'

export const imageSkeletons = (): ImageModel => ({
  ...urlToImageModel(usePatatoid(1)),
})
