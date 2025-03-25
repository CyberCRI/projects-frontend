import BaseModel from '@/models/base.model'
import { AttachmentType } from '@/models/types'

/**
 * @name AttachmentLinkModel
 * @description Link attached to a project
 */
export interface AttachmentLinkModel extends BaseModel {
  attachment_type: AttachmentType
  description: string
  preview_image_url: string
  site_name: string
  site_url: string
  title: string
}

export type AttachmentLinkOutput = Required<AttachmentLinkModel>

export type AttachmentLinkInput = Required<AttachmentLinkModel> & {
  project_id: string
  link_id?: string
}
