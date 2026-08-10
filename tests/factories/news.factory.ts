import { BaseTranslatedLocationFactory } from '~~/tests/factories/location.factory'
import type { NewsModel, TranslatedNews } from 'shared-projects-frontend/models'
import { OrganizationOutputFactory } from './organization.factory'
import { createFactory } from 'faker-create-factory'
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

export const TranslatedNewsFactory = createFactory<TranslatedNews>(() => {
  const news = NewsFactory.generate()
  return {
    ...news,
    $t: {
      content: news.content,
      title: news.title,
    },
    location: news.location ? BaseTranslatedLocationFactory.generate(news.location) : null,
  }
})
