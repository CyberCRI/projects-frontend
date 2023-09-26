import { createFactory } from 'faker-create-factory'

import {
    OrganizationModel,
    OrganizationOutput,
    OrganizationPatchInput,
} from '@/models/organization.model'
import BaseFactory from './base.factory'
import FaqFactory from './faq.factory'
import OrganizationDirectoryFactory from './organization-directory.factory'
import WikipediaTagFactory from './wikipedia-tag.factory'
import OrganizationTagFactory from './organization-tag.factory'

const OrganizationFactory = createFactory<OrganizationModel>((faker) => ({
    ...BaseFactory.generate(),
    background_color: faker.datatype.string(),
    banner_image: faker.image.image(),
    code: faker.datatype.string(),
    contact_email: faker.internet.email(),
    dashboard_title: faker.lorem.sentence(),
    dashboard_subtitle: faker.lorem.sentence(),
    language: 'fr',
    logo_image: {
        name: faker.datatype.string(),
        url: faker.image.image(),
        variations: {
            full: faker.image.image(),
            large: faker.image.image(),
            medium: faker.image.image(),
            original: faker.image.image(),
            small: faker.image.image(),
        },
    },
    main_org_logo_visibility: faker.datatype.boolean(),
    is_logo_visible_on_parent_dashboard: faker.datatype.boolean(),
    name: faker.datatype.string(),
    wikipedia_concepts: [],
    website_url: faker.internet.url(),
    faq: FaqFactory.generate(),
    wikipedia_tags: WikipediaTagFactory.generateMany(2),
    tags: OrganizationTagFactory.generateMany(2),
    children: [],
}))

export const OrganizationOutputFactory = createFactory<OrganizationOutput>(() => ({
    ...OrganizationFactory.generate(),
    faq: FaqFactory.generate(),
    organization_directory: OrganizationDirectoryFactory.generate(),
    wikipedia_tags: WikipediaTagFactory.generateMany(2),
    tags: OrganizationTagFactory.generateMany(2),
    children: [],
}))

export const OrganizationPatchInputFactory = createFactory<OrganizationPatchInput>(() => ({
    ...OrganizationFactory.generate(),
    wikipedia_tags_ids: WikipediaTagFactory.generateMany(2).map((tag) => tag.wikipedia_qid),
    tags_ids: OrganizationTagFactory.generateMany(2).map((tag) => tag.id),
}))
