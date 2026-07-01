import type { AttachmentType } from '~/models/types'
import type BaseModel from '~/models/base.model'

import type { Translated } from '~/interfaces/translated'

/**
 * @name AttachmentFileModel
 * @description Files attached to a project
 */
export interface AttachmentFileModel extends BaseModel {
  id: number
  file: string
  title: string
  attachment_type: AttachmentType
  description: string
  mime: string
}

export type AttachmentFileId = AttachmentFileModel['id']

export type AttachmentFileForm = Omit<AttachmentFileModel, 'id'> & {
  id?: number
}

export type TranslatedAttachmentFile = Translated<AttachmentFileModel, 'title' | 'description'>

export type AttachmentFileInput = Required<AttachmentFileModel> & {
  file: File
  project_id: string
}
