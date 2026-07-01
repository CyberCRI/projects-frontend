import { createFactory } from 'faker-create-factory'

import { AttachmentFileModel } from '~/models/attachment-file.model'
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
