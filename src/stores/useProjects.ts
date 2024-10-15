import { defineStore } from 'pinia'
import { ProjectOutput, ProjectPatchInput } from '@/models/project.model'
import { getProject, patchProject, lockUnlockProject } from '@/api/projects.service'

export interface ProjectState {
    project: ProjectOutput
}

const useProjectsStore = defineStore('projects', {
    state: (): ProjectState => ({
        project: null,
    }),
    getters: {
        currentProjectId() {
            return this.project?.id
        },
        currentProjectSlug() {
            return this.project?.slug
        },
    },
    actions: {
        async updateProject({
            id,
            project,
        }: {
            id: string
            project: ProjectPatchInput | FormData
            scope?: string
        }) {
            const result = await patchProject(id, project)
            this.project = { ...this.project, ...result }
            return result
        },

        async getProject(slugOrId: string): Promise<ProjectOutput> {
            try {
                const result = await getProject(slugOrId, true)
                this.project = result
                return result
            } catch (err) {
                throw new Error(err)
            }
        },

        async lockUnlockProject({ project_id, context }): Promise<ProjectOutput> {
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
