<template>
    <div class="linked-projects">
        <DynamicGrid
            :min-gap="20"
            class="linked-projects-ctn"
            v-if="linkedProjectsReordered?.length"
        >
            <div
                class="linked-project-card"
                v-for="aLinkedProject in linkedProjectsReordered"
                :key="aLinkedProject.id"
            >
                <ProjectCard :project="aLinkedProject.project" />

                <div v-if="canEditAndDelete" class="actions-ctn">
                    <ContextActionButton
                        action-icon="Close"
                        @click="confirmDelete(aLinkedProject)"
                    />
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
import DynamicGrid from '@/components/base/DynamicGrid.vue'
import analytics from '@/analytics'
import { deleteLinkedProject } from '@/api/projects.service'
export default {
    name: 'LinkedProjects',

    mixins: [permissions],

    inject: ['projectLayoutToggleAddModal'],

    emits: ['reload-linked-projects'],

    components: {
        ProjectCard,
        ContextActionButton,
        ConfirmModal,
        DynamicGrid,
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        linkedProjects: {
            type: Array,
            default: () => [],
        },

        isEditable: {
            type: Boolean,
            default: false,
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
            return this.isEditable && this.canEditProject
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
                await deleteLinkedProject({
                    project_id: this.project.id,
                    id: this.projectToBeDeleted.id,
                })

                this.$emit('reload-linked-projects')

                analytics.linkedProject.removeLinkedProject({
                    project: {
                        id: this.project.id,
                    },
                    linkedProject: this.projectToBeDeleted,
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
