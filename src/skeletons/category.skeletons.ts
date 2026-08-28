import type { ProjectCategoryModel } from 'shared-projects-frontend/models'

export const categorySkeleton = (def?: Partial<ProjectCategoryModel>): ProjectCategoryModel => ({
  id: -1,
  slug: 'slug',
  name: 'name',
  description: 'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  background_image: null,
  organization: null,
  sdgs: [],
  tags: [],
  parent: null,
  children: [],
  projects_count: 3,
  hierarchy: [],
  ...def,
})
