import analytics from '@/analytics'
import { LinkedProject } from '@/models/project.model'

export interface LinkedProjectAnalytic {
    project: {
        id: string
    }
    linkedProject: LinkedProject
}
export default {
    addLinkedProject(project: LinkedProjectAnalytic) {
        analytics.track('add_linked_project', project)
    },

    patchLinkedProject(project: LinkedProjectAnalytic) {
        analytics.track('patch_linked_project', project)
    },

    removeLinkedProject(project: LinkedProjectAnalytic) {
        analytics.track('remove_linked_project', project)
    },
}
