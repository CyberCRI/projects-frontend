import analytics from '@/analytics'
import { AttachmentFileModel } from '@/models/attachment-file.model'

export interface AttachmentAnalytic {
  project: {
    id: string
  }
  attachment: AttachmentFileModel
}

export default {
  /**
   * "Add attachment" analytic event
   * @param attachment
   */
  addAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('add_attachment-file', attachment)
  },

  /**
   * "Update attachment" analytic event
   * @param attachment
   */
  updateAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('update_attachment-file', attachment)
  },

  /**
   * "Remove attachment" analytic event
   * @param attachment
   */
  removeAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('remove_attachment-file', attachment)
  },
}
