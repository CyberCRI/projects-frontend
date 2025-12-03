import { Translated } from '@/interfaces/translated'
import BaseModel from '@/models/base.model'
import { AttachmentType } from '@/models/types'

/**
 * @name AttachmentFileModel
 * @description Files attached to a project
 */
export interface AttachmentFileModel extends BaseModel {
  file: File
  title: string
  attachment_type: AttachmentType
  description: string
  mime: string
}

export type TranslatedAttachmentFileModel = Translated<AttachmentFileModel, 'title' | 'description'>

export type AttachmentFileOutput = Required<AttachmentFileModel>

export type AttachmentFileInput = Required<AttachmentFileModel> & {
  project_id: string
}
