import type { PeopleGroupModel } from '~/models/people-group.model'
import type { ImageModel } from '~/models/image.model'

export default interface InvitationUserModel {
  owner: {
    id: number
    given_name: string
    email: string
    family_name: string
    pronouns: string
    job: string
    profile_picture: ImageModel
    current_org_role: string | null
  }
}

/**
 * @name InvitationModel
 * @description Invitation models
 */
export interface InvitationModel {
  token: string
  created_at: string
  people_group: PeopleGroupModel
  id: number
  organization: string
  description: string
  ownner: InvitationUserModel
  expire_at: string
}

export interface InvitationModelInput {
  people_group_id: number
  description: string
  expire_at: string
}
