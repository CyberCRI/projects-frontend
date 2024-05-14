<template>
    <div class="linked-projects">
        <DynamicGrid
            :min-gap="20"
            class="linked-projects-ctn"
            v-if="linkedProjectsReordered?.length"
        >
            <div
                class="linked-project-card"
                v-for="project in linkedProjectsReordered"
                :key="project.id"
            >
                <ProjectCard :project="project.project" />

                <div v-if="canEditAndDelete" class="actions-ctn">
                    <ContextActionButton action-icon="Close" @click="confirmDelete(project)" />
                </div>
            </div>
        </DynamicGrid>

        <ConfirmModal
            v-if="confirmModalVisible"
            :content="$t('project.linked-project-confirm-delete')"
            :title="$t('common.delete')"
            @cancel="confirmModalVisible = false"
            @confirm="deleteLinkedProject"
        />
    </div>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'
import DynamicGrid from '@/components/lpikit/DynamicGrid/DynamicGrid.vue'

export default {
    name: 'LinkedProjects',

    mixins: [permissions],

    inject: ['projectLayoutToggleAddModal'],

    components: {
        ProjectCard,
        ContextActionButton,
        ConfirmModal,
        DynamicGrid,
    },

    props: {
        linkedProjects: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            confirmModalVisible: false,
            projectToBeDeleted: null,
        }
    },

    computed: {
        canEditAndDelete() {
            return this.canEditProject && this.$route.name === 'projectLinkedProjects'
        },

        linkedProjectsReordered() {
            return this.linkedProjects.reduce((acc, curr) => {
                return curr.reason === 'other' || curr.reason === 'autre' || curr.reason === ''
                    ? [...acc, curr]
                    : [curr, ...acc]
            }, [])
        },
    },

    methods: {
        confirmDelete(linkedProject) {
            this.projectToBeDeleted = linkedProject
            this.confirmModalVisible = true
        },

        async deleteLinkedProject() {
            try {
                await this.$store.dispatch('projects/deleteLinkedProject', {
                    project_id: this.$store.getters['projects/currentProjectId'],
                    id: this.projectToBeDeleted.id,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.linked-project-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.linked-project-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.confirmModalVisible = false
                this.projectToBeDeleted = null
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.linked-projects {
    margin-top: $space-l;

    .linked-projects-ctn {
        position: relative;
        width: 100%;
        justify-content: space-between;

        //.linked-project-ctn {
        //    flex-basis: calc(50% - #{$space-l});
        //}

        .linked-project-card {
            position: relative;
            width: min-content;
        }

        .actions-ctn {
            position: absolute;
            top: -18px;
            right: -14px;
            display: flex;

            button:last-of-type {
                margin-left: $space-xs;
            }
        }

        .reason-label {
            color: $primary-dark;
            text-transform: uppercase;
            font-size: $font-size-xs;
            font-weight: 700;
            margin-bottom: $space-s;
            text-align: center;
        }
    }
}
</style>
