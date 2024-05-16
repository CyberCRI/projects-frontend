<template>
    <div class="project-goals">
        <SdgRecap :sdgs="project.sdgs" />

        <div class="add-goal" v-if="canEditProject">
            <LpiButton
                v-if="canEditProject"
                :label="$filters.capitalize($t('goal.add'))"
                class="add-goal-btn"
                @click="projectLayoutToggleAddModal('goal')"
            />
        </div>

        <GoalItem
            v-for="(goal, index) in project.goals"
            :key="index"
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
        />
    </div>
</template>

<script>
import SdgRecap from '@/components/project/SdgRecap/SdgRecap.vue'
import GoalItem from '@/components/project/GoalItem/GoalItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import permissions from '@/mixins/permissions.ts'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'ProjectGoalsTab',

    mixins: [permissions, ProjectTab],

    components: { SdgRecap, GoalItem, ConfirmModal, LpiButton },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },
    },

    data() {
        return {
            confirmDeleteVisible: false,
            goalToBeDeleted: null,
        }
    },

    inject: ['projectLayoutToggleAddModal'],

    methods: {
        editGoal(goal) {
            this.projectLayoutToggleAddModal('goal', goal)
        },

        async deleteGoal() {
            try {
                await this.$store.dispatch('goals/deleteGoal', this.goalToBeDeleted.id)
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
