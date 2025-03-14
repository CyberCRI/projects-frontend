import { createFactory } from 'faker-create-factory'

import { ProjectModel, ProjectOutput } from '@/models/project.model'
import { BaseFactory } from './base.factory'
import { ProjectCategoryOutputFactory } from './project-category.factory'
import { ProjectTeamOutputFactory } from './project-member.factory'
import LocationFactory from './location.factory'
import locationFactory from './location.factory'
import { OrganizationOutputFactory } from './organization.factory'
import SdgFactory from './sdg.factory'
import { GoalFactory } from './goal.factory'
import { AttachmentLinkFactory } from './attachment-link.factory'
import { AttachmentFileFactory } from './attachment-file.factory'
import { ImageFactory } from './image.factory'
import { CommentFactory } from './comment.factory'
import { ReviewFactory } from './review.factory'
import { TemplateFactory } from './template.factory'
import BlogEntryFactory from './blog-entry.factory'
import TagFactory from './tag.factory'

// Remove id type number
const { id, ...restBaseFactory } = BaseFactory.generate()

export const ProjectFactory = createFactory<ProjectModel>((faker) => ({
  ...restBaseFactory,
  id: faker.datatype.string(),
  category_id: faker.datatype.number(),
  categories: ProjectCategoryOutputFactory.generateMany(2),
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraphs(),
  header_image: {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    url: faker.datatype.string(),
    height: faker.datatype.number(),
    width: faker.datatype.number(),
    created_at: new Date(),
    variations: {
      full: faker.image.image(),
      large: faker.image.image(),
      medium: faker.image.image(),
      original: faker.image.image(),
      small: faker.image.image(),
    },
  },
  is_locked: faker.datatype.boolean(),
  is_shareable: faker.datatype.boolean(),
  purpose: faker.lorem.sentence(),
  language: 'fr',
  locations: locationFactory.generateMany(2),
  publication_status: 'public',
  life_status: 'running',
  reviews: ReviewFactory.generateMany(2),
  organizations: OrganizationOutputFactory.generate(),
  tags: TagFactory.generateMany(2),
  links: AttachmentLinkFactory.generateMany(2),
  files: AttachmentFileFactory.generateMany(2),
  follows: [],
  is_followed: {
    is_followed: false,
    follow_id: null,
  },
  announcements: [],
  blog_entries: BlogEntryFactory.generateMany(2),
  goals: GoalFactory.generateMany(2),
  slug: faker.lorem.word(),
}))

export const ProjectOutputFactory = createFactory<ProjectOutput>((faker) => ({
  ...ProjectFactory.generate(),
  team: ProjectTeamOutputFactory.generate(),
  organizations: OrganizationOutputFactory.generateMany(2),
  categories: ProjectCategoryOutputFactory.generateMany(2),
  geolocation_coordinates: LocationFactory.generate(),
  tags: TagFactory.generateMany(2),
  sdgs: SdgFactory.generateMany(2),
  goals: GoalFactory.generateMany(2),
  links: AttachmentLinkFactory.generateMany(2),
  files: AttachmentFileFactory.generateMany(2),
  images: ImageFactory.generateMany(2),
  comments: CommentFactory.generateMany(2),
  blog_entries: BlogEntryFactory.generateMany(2),
  linked_projects: [],
  views: faker.datatype.number(),
  template: TemplateFactory.generate(),
  follows: [],
  is_followed: {
    is_followed: false,
    follow_id: null,
  },
  slug: faker.lorem.word(),
}))
