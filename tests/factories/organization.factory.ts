import { createFactory } from 'faker-create-factory'

import {
  OrganizationModel,
  OrganizationOutput,
  OrganizationPatchInput,
} from '@/models/organization.model'
import BaseFactory from './base.factory'
import FaqFactory from './faq.factory'
import OrganizationDirectoryFactory from './organization-directory.factory'
import TagFactory from './tag.factory'
import { ImageFactory } from './image.factory'

const OrganizationFactory = createFactory<OrganizationModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  background_color: faker.datatype.string(),
  banner_image: ImageFactory.generate(),
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
  website_url: faker.internet.url(),
  faq: FaqFactory.generate(),
  tags: TagFactory.generateMany(2),
  children: [],
  enabled_projects_tag_classifications: [], // TODO: define this type
  enabled_skills_tag_classifications: [], // TODO: define this type
  terms_and_conditions: null,
  auto_translate_content: false,
  description: '',
  chat_button_text: '',
  onboarding_enabled: false,
}))

export const OrganizationOutputFactory = createFactory<OrganizationOutput>((faker) => ({
  ...OrganizationFactory.generate(),
  faq: FaqFactory.generate(),
  organization_directory: OrganizationDirectoryFactory.generate(),
  tags: TagFactory.generateMany(2),
  children: [],
  chat_url: faker.internet.url(),
}))

export const OrganizationPatchInputFactory = createFactory<OrganizationPatchInput>(() => ({
  ...OrganizationFactory.generate(),
  tags: TagFactory.generateMany(2).map((tag) => tag.id),
}))
