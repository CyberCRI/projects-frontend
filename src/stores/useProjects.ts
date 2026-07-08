import { getProject, lockUnlockProject, patchProject } from 'shared-projects-frontend/apis'

import type { ProjectForm, ProjectModel, ProjectOutput } from 'shared-projects-frontend/models'
import { defineStore } from 'pinia'

export interface ProjectState {
  project: ProjectOutput | ProjectModel
}

const useProjectsStore = defineStore('projects', {
  state: (): ProjectState => ({
    project: null,
  }),
  getters: {
    currentProjectId(): string | undefined {
      return this.project?.id
    },
    currentProjectSlug(): string | undefined {
      return this.project?.slug
    },
  },
  actions: {
    async updateProject({ id, project }: { id: string; project: ProjectForm; scope?: string }) {
      const result = await patchProject(id, project)
      this.project = { ...this.project, ...result }
      return result
    },

    async getProject(slugOrId: string): Promise<ProjectModel> {
      try {
        const result = await getProject(slugOrId, { noError: true })
        this.project = result
        return result
      } catch (err) {
        throw new Error(err)
      }
    },

    async lockUnlockProject({ project_id, context }) {
      try {
        this.project.is_locked = context === 'lock'
        return await lockUnlockProject({ project_id, context })
      } catch (err) {
        throw new Error(err)
      }
    },
  },
})

export default useProjectsStore
