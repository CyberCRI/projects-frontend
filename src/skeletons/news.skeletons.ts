import type { NewsModel } from '~/models/news.model'

export const newsSkeleton = (def?: Partial<NewsModel>): Omit<NewsModel, 'id'> => ({
  id: -1,
  title: 'title',
  content: 'Ipsum nostrud officia dolor esse exercitation mollit',
  images: [],
  header_image: null,
  publication_date: '2020-01-01',
  people_groups: [],
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
  organization: null,
  visible_by_all: true,
  location: null,
  ...def,
})
