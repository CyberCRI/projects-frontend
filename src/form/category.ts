import type { ProjectCategoryModel } from 'shared-projects-frontend/models'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultProjectCategoryForm = (): Partial<ProjectCategoryModel> => {
  return {
    name: '',
    description: NULL_CONTENT,
    background_color: '#81A617',
    foreground_color: '#FFFFFF',
    background_image: null,
    is_reviewable: true,
    only_reviewer_can_publish: false,
    // @ts-expect-error TODO refactor this
    organization_code: null,
    children: [],
    order_index: 0,
    templates: [],
  }
}
