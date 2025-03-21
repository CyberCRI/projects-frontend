import analytics from '@/analytics'
import { AttachmentLinkModel } from '@/models/attachment-link.model'

export interface AttachmentAnalytic {
  project: {
    id: string
  }
  attachment: AttachmentLinkModel
}

export default {
  /**
   * "Add attachment" analytic event
   * @param attachment
   */
  addAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('add_attachment-link', attachment)
  },

  /**
   * "Update attachment" analytic event
   * @param attachment
   */
  updateAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('update_attachment-link', attachment)
  },

  /**
   * "Remove attachment" analytic event
   * @param attachment
   */
  removeAttachment(attachment: AttachmentAnalytic): void {
    analytics.track('remove_attachment-link', attachment)
  },
}
