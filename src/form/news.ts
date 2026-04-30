import type { NewsForm } from '~/models/news.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultForm = (): NewsForm => ({
  header_image: null,
  imageSizes: null,
  title: '',
  content: NULL_CONTENT,
  publication_date: new Date().toISOString(),
  people_groups: {},
  visible_by_all: true,
  location: null,
})
