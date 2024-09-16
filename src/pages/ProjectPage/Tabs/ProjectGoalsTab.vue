<template>
    <div class="project-goals">
        <SdgRecap :sdgs="sdgs" />

        <div class="add-goal" v-if="canEditProject">
            <LpiButton
                v-if="canEditProject"
                :label="$filters.capitalize($t('goal.add'))"
                class="add-goal-btn"
                @click="projectLayoutToggleAddModal('goal')"
            />
        </div>

        <GoalItem
            v-for="goal in goals"
            :key="goal.id"
            :goal="goal"
            :can-edit-goal="canEditProject"
            :can-delete-goal="canEditProject"
            @edit-goal="editGoal"
            @delete-goal="toggleDeleteConfirmModal"
        />

        <ConfirmModal
            v-if="confirmDeleteVisible"
            :title="$t('goal.delete')"
            :content="$t('common.destroy-confirm')"
            @cancel="toggleDeleteConfirmModal"
            @confirm="deleteGoal"
            :asyncing="asyncing"
        />
    </div>
</template>

<script>
import SdgRecap from '@/components/project/sdg/SdgRecap.vue'
import GoalItem from '@/components/project/goal/GoalItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

import { deleteGoal } from '@/api/goals.service'
import analytics from '@/analytics'

export default {
    name: 'ProjectGoalsTab',

    emits: ['reload-goals'],

    mixins: [permissions, ProjectTab],

    components: { SdgRecap, GoalItem, ConfirmModal, LpiButton },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },

        goals: {
            type: Array,
            default: () => [],
        },

        sdgs: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            confirmDeleteVisible: false,
            goalToBeDeleted: null,
            asyncing: false,
        }
    },

    inject: ['projectLayoutToggleAddModal'],

    methods: {
        editGoal(goal) {
            this.projectLayoutToggleAddModal('goal', goal)
        },

        async deleteGoal() {
            this.asyncing = true
            try {
                await deleteGoal({
                    id: this.goalToBeDeleted.id,
                    project_id: this.project.id,
                })

                this.$emit('reload-goals')

                analytics.goal.removeGoalProject({
                    project: {
                        id: this.project.id,
                    },
                    goal: this.goalToBeDeleted,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.goal-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.goal-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.asyncing = false
                this.toggleDeleteConfirmModal()
            }
        },

        toggleDeleteConfirmModal(goal) {
            this.confirmDeleteVisible = !this.confirmDeleteVisible
            if (this.confirmDeleteVisible) this.goalToBeDeleted = goal
        },
    },
}
</script>

<style lang="scss" scoped>
.project-goals {
    padding: $space-2xl 0;

    > div:not(:first-of-type) {
        margin-top: $space-l;
    }

    .add-goal {
        display: flex;
        justify-content: flex-end;
        padding: $space-l 0;
    }
}
</style>
