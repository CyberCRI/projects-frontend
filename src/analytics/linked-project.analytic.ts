import type { LinkedProject } from 'shared-projects-frontend/models'

import analytics from '~/analytics'

export default {
  addLinkedProject(project: LinkedProject) {
    analytics.track('add_linked_project', project)
  },

  patchLinkedProject(project: LinkedProject) {
    analytics.track('patch_linked_project', project)
  },

  removeLinkedProject(project: LinkedProject) {
    analytics.track('remove_linked_project', project)
  },
}
