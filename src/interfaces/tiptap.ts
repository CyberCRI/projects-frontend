import type { ImageModel } from 'shared-projects-frontend/models/image.model'

export type CollaborativeUser = {
  name: string
  color: string
  pid: number
  profile_picture: ImageModel
}
