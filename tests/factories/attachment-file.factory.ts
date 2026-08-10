import { createFactory } from 'faker-create-factory'

import type { AttachmentFileModel } from 'shared-projects-frontend/models'
import BaseFactory from './base.factory'

export const AttachmentFileFactory = createFactory<AttachmentFileModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  file: 'test-file.png',
  title: faker.lorem.word(),
  attachment_type: 'file',
  description: faker.datatype.string(),
  mime: faker.datatype.string(),
}))
