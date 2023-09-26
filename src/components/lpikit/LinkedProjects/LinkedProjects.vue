<template>
    <div class="linked-projects">
        <div class="linked-projects-ctn">
            <div v-for="project in linkedProjectsReordered" :key="project.id">
                <!--                <div class="reason-label">-->
                <!--                    {{-->
                <!--                        project.reason === ''-->
                <!--                            ? $t('project.linked-project-other-reason')-->
                <!--                            : project.reason-->
                <!--                    }}-->
                <!--                </div>-->

                <div class="linked-project-card">
                    <ProjectCard :project="project.project" />

                    <div v-if="canEditAndDelete" class="actions-ctn">
                        <LpiButton left-icon="Close" size="small" @click="confirmDelete(project)" />
                    </div>
                </div>
            </div>
        </div>

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
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'LinkedProjects',

    mixins: [permissions],

    inject: ['projectLayoutToggleAddModal'],

    components: {
        ProjectCard,
        LpiButton,
        ConfirmModal,
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
        display: flex;
        flex-wrap: wrap;
        gap: $space-l $space-m;
        justify-content: flex-start;

        //.linked-project-ctn {
        //    flex-basis: calc(50% - #{$space-l});
        //}

        .linked-project-card {
            position: relative;
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
