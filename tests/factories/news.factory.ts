import { OrganizationOutputFactory } from './organization.factory'
import { createFactory } from 'faker-create-factory'
import { NewsModel } from '~/models/news.model'
import BaseFactory from './base.factory'

export const NewsFactory = createFactory<NewsModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.lorem.text(),
  content: faker.lorem.text(),
  created_at: new Date().toISOString(),
  images: [],
  location: null,
  people_groups: [],
  visible_by_all: true,
  header_image: null,
  organization: OrganizationOutputFactory.generate(),
  publication_date: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))
