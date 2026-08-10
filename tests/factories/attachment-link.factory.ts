import { createFactory } from 'faker-create-factory'

import type { AttachmentLinkModel } from 'shared-projects-frontend/models'
import BaseFactory from './base.factory'

export const AttachmentLinkFactory = createFactory<AttachmentLinkModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  attachment_type: 'file',
  description: faker.lorem.sentence(),
  preview_image_url: faker.internet.url(),
  site_name: faker.lorem.word(),
  site_url: faker.internet.url(),
  title: faker.lorem.word(),
}))
