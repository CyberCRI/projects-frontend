import type { AttachmentLinkModel } from 'shared-projects-frontend/models/attachment-link.model'
import type { AttachmentFileModel } from 'shared-projects-frontend/models/attachment-file.model'

export const attachementLinkSkeletons = (
  def?: Partial<AttachmentLinkModel>
): Omit<AttachmentLinkModel, 'id'> => ({
  id: -1,
  title: 'title',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  attachment_type: 'image',
  site_name: 'learningplanetinstitute',
  site_url: 'https://projects.learningplanetinstitute.org',
  preview_image_url: null,
  ...(def || {}),
})

export const attachementFileSkeletons = (
  def?: Partial<AttachmentFileModel>
): Omit<AttachmentFileModel, 'id'> => ({
  id: -1,
  title: 'title',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  attachment_type: 'image',
  file: null,
  mime: null,
  ...(def || {}),
})
