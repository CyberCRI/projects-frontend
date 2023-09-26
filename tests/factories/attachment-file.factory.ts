import { createFactory } from 'faker-create-factory'

import { AttachmentFileInput, AttachmentFileOutput } from '@/models/attachment-file.model'
import BaseFactory from './base.factory'

export const AttachmentFileFactory = createFactory<AttachmentFileOutput>((faker) => ({
    ...BaseFactory.generate(),
    file: new File([], 'test-file.png'),
    title: faker.lorem.word(),
    attachment_type: 'file',
    description: faker.datatype.string(),
    mime: faker.datatype.string(),
}))

export const AttachmentFileInputFactory = createFactory<AttachmentFileInput>((faker) => ({
    ...AttachmentFileFactory.generate(),
    project_id: faker.datatype.string(),
}))
