import { createFactory } from 'faker-create-factory'

export const PaginationsFactory = createFactory<PaginationResult>((faker) => ({
  count: 10,
  total_page: 100,
  current_page: 1,
  results: [],
}))
