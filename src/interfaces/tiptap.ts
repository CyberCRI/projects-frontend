import { ImageModel } from '~/models/image.model'

export type CollaborativeUser = {
  name: string
  color: string
  pid: number
  profile_picture: ImageModel
}
