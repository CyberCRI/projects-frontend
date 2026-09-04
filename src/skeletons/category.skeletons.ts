import type { ProjectCategoryModel } from 'shared-projects-frontend/models'

export const categorySkeleton = (def?: Partial<ProjectCategoryModel>): ProjectCategoryModel => ({
  id: -1,
  slug: 'slug',
  name: 'name',
  description: 'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  background_image: null,
  organization: null,
  tags: [],
  parent: null,
  children: [],
  projects_count: 3,
  hierarchy: [],
  background_color: null,
  foreground_color: null,
  is_followed: {
    follow_id: null,
    is_followed: false,
  },
  is_reviewable: false,
  is_root: false,
  only_reviewer_can_publish: false,
  order_index: 0,
  templates: null,
  ...def,
})
