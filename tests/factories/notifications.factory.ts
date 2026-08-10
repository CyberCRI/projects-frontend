import type { NotificationSettingsModel } from 'shared-projects-frontend/models'
import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'

export const NotificationSettingsFactory = createFactory<NotificationSettingsModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  notify_added_to_project: faker.datatype.boolean(),
  announcement_published: faker.datatype.boolean(),
  announcement_has_new_application: faker.datatype.boolean(),
  followed_project_has_been_edited: faker.datatype.boolean(),
  project_has_been_commented: faker.datatype.boolean(),
  project_has_been_edited: faker.datatype.boolean(),
  project_ready_for_review: faker.datatype.boolean(),
  project_has_been_reviewed: faker.datatype.boolean(),
  project_has_new_private_message: faker.datatype.boolean(),
  category_project_created: faker.datatype.boolean(),
  category_project_updated: faker.datatype.boolean(),
  comment_received_a_response: faker.datatype.boolean(),
  organization_has_new_access_request: faker.datatype.boolean(),
  invitation_link_will_expire: faker.datatype.boolean(),
  new_instruction: faker.datatype.boolean(),
}))
