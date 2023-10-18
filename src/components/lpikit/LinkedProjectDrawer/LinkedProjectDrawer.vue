<template>
    <DrawerLayout
        :is-opened="isOpened"
        :has-footer="hasFooter"
        :title="
            editedLinkedProject
                ? $t('project.edit-linked-project')
                : listProjects.length
                ? $t('project.add-linked-project') + ' (' + listProjects.length + ')'
                : $t('project.add-linked-project')
        "
        :selected-projects="listProjects"
        :padding="true"
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
                v-for="project in listProjects"
                :key="project.id"
                :has-close-icon="true"
                :project="project"
                class="selected-card"
                @unselect="unselectProject"
            />
        </div>
        <ProjectSelection
            :selected-projects="listProjects"
            @select-project="addProject"
            @batch-project="addBatch"
            @search-done="search"
        />
    </DrawerLayout>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ProjectSelection from './ProjectSelection.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'

export default {
    name: 'LinkedProjectDrawer',

    emits: ['close', 'clear', 'unselect'],

    components: { DrawerLayout, ProjectSelection, ProjectCard },

    data() {
        return {
            selectedProject: null,
            selectedReason: undefined,
            listProjects: [],
            hasFooter: false,
            searchDone: false,
        }
    },

    props: {
        editedLinkedProject: {
            type: Object,
            default: null,
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    watch: {
        isOpened: {
            handler: function () {
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
            try {
                const target_id = this.$store.getters['projects/currentProjectId']
                let listLinkedProjects = []
                for (let i = 0; i < this.listProjects.length; i++) {
                    listLinkedProjects.push({
                        project_id: this.listProjects[i].id,
                        target_id: target_id,
                    })
                }
                let body = { projects: listLinkedProjects }
                await this.$store.dispatch('projects/addLinkedProject', {
                    id: this.$store.getters['projects/currentProjectId'],
                    body: body,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.linked-project-create.success'),
                    type: 'success',
                })

                if (this.$route.name !== 'projectLinkedProjects') {
                    this.$router.push(
                        `/projects/${this.$store.getters['projects/currentProjectSlug']}/linked-projects`
                    )
                }
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.linked-project-create.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.listProjects.splice(0)
                this.closeModal()
            }
        },

        async editLinkedProject() {
            try {
                await this.$store.dispatch('projects/patchLinkedProject', {
                    id: this.editedLinkedProject.id,
                    target_id: this.$store.getters['projects/currentProjectId'],
                    body: {
                        project_id: this.selectedProject.id,
                        target_id: this.$store.getters['projects/currentProjectId'],
                        reason: this.selectedReason,
                    },
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.linked-project-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.linked-project-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.closeModal()
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
