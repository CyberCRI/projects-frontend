import type { NewsForm } from '~/models/news.model'

export const defaultForm = (): NewsForm => ({
  header_image: null,
  imageSizes: null,
  title: '',
  content: '<p></p>',
  publication_date: new Date().toISOString(),
  people_groups: {},
  visible_by_all: true,
  location: null,
})
