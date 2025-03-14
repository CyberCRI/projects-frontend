<template>
  <div class="project-goals">
    <SdgRecap :sdgs="sdgs" />

    <div v-if="canEditProject" class="add-goal">
      <LpiButton
        v-if="canEditProject"
        :label="$filters.capitalize($t('goal.add'))"
        class="add-goal-btn"
        @click="projectLayoutToggleAddModal('goal')"
      />
    </div>

    <GoalItem
      v-for="goal in sortedGoals"
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
      :asyncing="asyncing"
      @cancel="toggleDeleteConfirmModal"
      @confirm="doDeleteGoal"
    />
  </div>
</template>

<script>
import SdgRecap from '@/components/project/sdg/SdgRecap.vue'
import GoalItem from '@/components/project/goal/GoalItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

import { deleteGoal } from '@/api/goals.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'

export default {
  name: 'ProjectGoalsTab',

  components: { SdgRecap, GoalItem, ConfirmModal, LpiButton },

  inject: ['projectLayoutToggleAddModal'],

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

  emits: ['reload-goals'],

  setup() {
    const toaster = useToasterStore()
    useScrollToTab()
    const { canEditProject } = usePermissions()
    return {
      toaster,
      canEditProject,
    }
  },

  data() {
    return {
      confirmDeleteVisible: false,
      goalToBeDeleted: null,
      asyncing: false,
    }
  },

  computed: {
    sortedGoals() {
      return [...this.goals].sort((a, b) => {
        if (!a.deadline_at && !b.deadline_at) {
          return a.title < b.title ? -1 : 1
        } else if (!a.deadline_at) {
          return -1
        } else if (!b.deadline_at) {
          return 1
        } else {
          return a.deadline_at < b.deadline_at ? -1 : 1
        }
      })
    },
  },

  methods: {
    editGoal(goal) {
      this.projectLayoutToggleAddModal('goal', goal)
    },

    async doDeleteGoal() {
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
        this.toaster.pushSuccess(this.$t('toasts.goal-delete.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.goal-delete.error')} (${error})`)
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
