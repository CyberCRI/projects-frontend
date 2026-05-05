import type { OrganizationModel } from '~/models/organization.model'
import type { InvitationModel } from '~/models/invitation.model'
import type { ProjectModel } from '~/models/project.model'
import type { NotificationType } from '~/models/types'
import type { UserModel } from '~/models/user.model'
import type BaseModel from '~/models/base.model'

export interface NotificationModel extends BaseModel {
  id: number
  sender: UserModel
  receiver: UserModel

  organization: OrganizationModel
  project: ProjectModel
  access_request: any
  is_viewed: boolean
  to_send: boolean
  created: string
  reminder_message: string
  type: NotificationType
  context: { [key: string]: any }
  count: number

  // extra
  invitation: InvitationModel
}
