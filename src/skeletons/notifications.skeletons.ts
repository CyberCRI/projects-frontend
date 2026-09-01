import type { NotificationModel } from 'shared-projects-frontend/models'

export const notificationSkeleton = (def?: NotificationModel): NotificationModel => ({
  access_request: null,
  context: {},
  count: 1,
  created: new Date().toISOString(),
  id: -1,
  invitation: null,
  is_viewed: true,
  organization: null,
  project: null,
  receiver: null,
  reminder_message: '',
  sender: null,
  to_send: false,
  type: 'member_added_self',
  ...(def ?? {}),
})
