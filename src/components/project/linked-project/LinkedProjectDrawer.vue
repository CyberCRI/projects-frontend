<template>
    <BaseDrawer
        :is-opened="isOpened"
        :no-footer="!hasFooter"
        :title="
            editedLinkedProject
                ? $t('project.edit-linked-project')
                : listProjects.length
                  ? $t('project.add-linked-project') + ' (' + listProjects.length + ')'
                  : $t('project.add-linked-project')
        "
        :selected-projects="listProjects"
        :padding="true"
        :asyncing="asyncing"
        @unselect="unselectProject"
        @close="closeModal"
        @confirm="addLinkedProject"
    >
        <template v-if="listProjects.length" #header_clear>
            <div class="clear" @click="clearSelection">
                {{ $t('drawer.clear') }}
            </div>
        </template>

        <div v-if="listProjects.length" class="results-ctn">
            <ProjectCard
                v-for="aProject in listProjects"
                :key="aProject.id"
                :has-close-icon="true"
                :project="aProject"
                class="selected-card"
                @unselect="unselectProject"
            />
        </div>
        <LinkedProjectSelection
            :project="project"
            :selected-projects="listProjects"
            :already-linked-projects="alreadyLinkedProjects"
            @select-project="addProject"
            @batch-project="addBatch"
            @search-done="search"
        />
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import LinkedProjectSelection from './LinkedProjectSelection.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import analytics from '@/analytics'
import { addLinkedProject, patchLinkedProject } from '@/api/projects.service'
import useToasterStore from '@/stores/useToaster.ts'
import useProjectsStore from '@/stores/useProjects.ts'

export default {
    name: 'LinkedProjectDrawer',

    emits: ['close', 'clear', 'unselect', 'reload-linked-projects'],

    components: { BaseDrawer, LinkedProjectSelection, ProjectCard },
    setup() {
        const toaster = useToasterStore()
        const projectsStore = useProjectsStore()
        return {
            toaster,
            projectsStore,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        editedLinkedProject: {
            type: Object,
            default: null,
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
        alreadyLinkedProjects: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            selectedProject: null,
            selectedReason: undefined,
            listProjects: [],
            hasFooter: false,
            searchDone: false,
            asyncing: false,
        }
    },
    watch: {
        isOpened: {
            handler: function () {
                this.asyncing = false
                if (this.editedLinkedProject) {
                    this.selectedProject = this.editedLinkedProject.project
                    this.selectedReason = this.editedLinkedProject.reason
                } else {
                    this.selectedProject = null
                    this.selectedReason = undefined
                }
            },
            immediate: true,
        },
        searchDone: {
            handler: function () {
                if (!this.searchDone && this.listProjects.length < 1) {
                    this.hasFooter = false
                } else this.hasFooter = true
            },
            immediate: true,
        },
        listProjects: {
            handler: function () {
                if (!this.searchDone && this.listProjects.length < 1) {
                    this.hasFooter = false
                } else this.hasFooter = true
            },
            immediate: true,
            deep: true,
        },
    },

    methods: {
        async addProject(project) {
            if (this.editedLinkedProject) this.editLinkedProject()
            else {
                this.listProjects.push(project)
            }
        },

        async addBatch(projects) {
            if (this.editedLinkedProject) {
                this.editLinkedProject()
            } else {
                this.listProjects = this.listProjects.concat(projects)
            }
        },

        async addLinkedProject() {
            this.asyncing = true
            try {
                const projectId = this.project.id
                let addedLinkedProjects = this.listProjects.map((addedProject) => {
                    return {
                        project_id: addedProject.id,
                        target_id: projectId,
                    }
                })
                const addedLinkedProjectsIdSet = new Set(
                    addedLinkedProjects.map((addedLinkedProject) => addedLinkedProject.project_id)
                )
                let body = { projects: addedLinkedProjects }
                const result = await addLinkedProject({ id: projectId, body })
                result['linked_projects']
                    ?.filter((linked_project) =>
                        addedLinkedProjectsIdSet.has(linked_project.project.id)
                    )
                    .forEach((linked_project) => {
                        analytics.linkedProject.addLinkedProject({
                            project: {
                                id: this.project.id,
                            },
                            linkedProject: linked_project,
                        })
                    })
                this.$emit('reload-linked-projects', result['linked_projects'])

                this.toaster.pushSuccess(this.$t('toasts.linked-project-create.success'))

                if (this.$route.name !== 'projectLinkedProjects') {
                    this.$router.push({
                        name: 'projectLinkedProjects',
                        params: {
                            slugOrId: this.projectsStore.currentProjectSlug,
                        },
                    })
                }
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.linked-project-create.error')} (${error})`
                )
                console.error(error)
            } finally {
                this.listProjects.splice(0)
                this.closeModal()
                this.asyncing = false
            }
        },

        async editLinkedProject() {
            this.asyncing = true
            try {
                const id = this.editedLinkedProject.id
                const target_id = this.project.id
                const body = {
                    project_id: this.selectedProject.id,
                    target_id,
                    reason: this.selectedReason,
                }

                const result = await patchLinkedProject({ target_id, id, body })

                this.$emit('reload-linked-projects')
                analytics.linkedProject.patchLinkedProject({
                    project: {
                        id: this.project.id,
                    },
                    linkedProject: result,
                })
                this.toaster.pushSuccess(this.$t('toasts.linked-project-update.success'))
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.linked-project-update.error')} (${error})`
                )
                console.error(error)
            } finally {
                this.closeModal()
                this.asyncing = false
            }
        },

        closeModal() {
            this.hasFooter = false
            this.listProjects.splice(0)
            this.$emit('close')
        },

        clearSelection() {
            this.listProjects.splice(0)
        },
        unselectProject(project) {
            let index = this.listProjects.indexOf(project)
            if (index > -1) {
                this.listProjects.splice(index, 1)
            }
        },
        search(done) {
            this.searchDone = done
        },
    },
}
</script>

<style lang="scss" scoped>
.clear {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: 700;
    text-decoration: underline;
    margin-left: $space-l;
    cursor: pointer;
}

.results-ctn {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: $space-m;
    padding-inline: $space-l;
    padding-bottom: $space-l;

    .selected-card {
        background-color: $primary-lighter;
    }
}
</style>
