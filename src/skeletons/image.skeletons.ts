import type { ImageModel } from 'shared-projects-frontend/models'
import { urlToImageModel } from '~/functs/imageSizesUtils'

export const imageSkeletons = (): ImageModel => ({
  ...urlToImageModel(usePatatoid(1)),
})
