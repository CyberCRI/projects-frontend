import type { ProjectCategoryModel } from '~/models/project-category.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultForm = (): Partial<ProjectCategoryModel> => {
  return {
    name: '',
    description: NULL_CONTENT,
    background_color: '#81A617',
    foreground_color: '#FFFFFF',
    // @ts-expect-error TODO need to refacto this
    background_image: {
      variations: {
        small: undefined,
        full: undefined,
        medium: undefined,
        large: undefined,
        original: undefined,
      },
    },
    is_reviewable: true,
    only_reviewer_can_publish: false,
    organization_code: null,
    children: [],
    order_index: 0,
    templates: [],
  }
}
