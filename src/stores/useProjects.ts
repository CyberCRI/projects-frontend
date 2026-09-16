import type {
  ProjectModel,
  ProjectOutput,
  TranslatedProject,
} from 'shared-projects-frontend/models'
import { defineStore } from 'pinia'

export interface ProjectState {
  project: ProjectOutput | ProjectModel | TranslatedProject
}

const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
  }),
})

export default useProjectsStore
