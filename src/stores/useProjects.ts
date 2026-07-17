import type { ProjectModel, ProjectOutput } from 'shared-projects-frontend/models'
import { defineStore } from 'pinia'

export interface ProjectState {
  project: ProjectOutput | ProjectModel
}

const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
  }),
})

export default useProjectsStore
