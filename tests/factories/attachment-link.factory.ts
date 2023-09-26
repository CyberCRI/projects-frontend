import { createFactory } from 'faker-create-factory'

import { AttachmentLinkInput, AttachmentLinkOutput } from '@/models/attachment-link.model'
import BaseFactory from './base.factory'

export const AttachmentLinkFactory = createFactory<AttachmentLinkOutput>((faker) => ({
    ...BaseFactory.generate(),
    attachment_type: 'file',
    description: faker.lorem.sentence(),
    preview_image_url: faker.internet.url(),
    site_name: faker.lorem.word(),
    site_url: faker.internet.url(),
    title: faker.lorem.word(),
}))

export const AttachmentLinkInputFactory = createFactory<AttachmentLinkInput>((faker) => ({
    ...AttachmentLinkFactory.generate(),
    project_id: faker.datatype.string(),
    link_id: faker.datatype.string(),
}))
