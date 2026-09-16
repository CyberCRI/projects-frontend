import type { NotificationSettingsForm } from 'shared-projects-frontend/models'

export const defaultUserNotificationsSettingsForm = (): NotificationSettingsForm => ({
  followed_project_has_been_edited: false,
  notify_added_to_project: false,
  project_has_been_commented: false,
  project_has_been_edited: false,
  announcement_published: false,
  project_ready_for_review: false,
  project_has_been_reviewed: false,
  project_has_new_private_message: false,
  comment_received_a_response: false,
  organization_has_new_access_request: false,
  invitation_link_will_expire: false,
  new_instruction: false,
  category_project_created: false,
  category_project_updated: false,
  announcement_has_new_application: false,
})

export const useUserNotificationsSettingsForm = (options = {}) => {
  return useForm<NotificationSettingsForm>({
    default: defaultUserNotificationsSettingsForm(),
    ...options,
  })
}
