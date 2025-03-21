import BaseModel from '@/models/base.model'

export interface NotificationModel extends BaseModel {
  sender: number
  receiver: number
  project: string
  message: string
  created: string
  is_viewed: boolean
}
