<template>
  <div class="project-goals">
    <SdgRecap :sdgs="sdgs" :is-in-editing-mode="isInEditingMode" />

    <div v-if="isEditionEnabled" class="add-goal">
      <LpiButton
        v-if="isEditionEnabled"
        :label="$t('goal.add')"
        class="add-goal-btn"
        btn-icon="Plus"
        @click="showModalGoal('goal')"
      />
    </div>

    <GoalItem
      v-for="goal in sortedGoals"
      :key="goal.id"
      :goal="goal"
      :can-edit-goal="isEditionEnabled"
      :can-delete-goal="isEditionEnabled"
      @edit-goal="showModalGoal('goal', goal)"
      @delete-goal="localeDeleteGoal"
    />

    <ConfirmModal
      v-if="stateModal"
      :title="$t('goal.delete')"
      :content="$t('common.destroy-confirm')"
      :asyncing="asyncing"
      @cancel="localeCloseGoal"
      @confirm="onDeleteGoal"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'
import type { TranslatedGoal } from '~/models/goal.model'

import { deleteGoal } from '~/api/goals.service'

import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'
import GoalItem from '~/components/project/goal/GoalItem.vue'
import SdgRecap from '~/components/project/sdg/SdgRecap.vue'

import useToasterStore from '~/stores/useToaster'

import analytics from '~/analytics'

const showModalGoal = inject<(key: string, goal?: TranslatedGoal) => void>(
  'projectLayoutToggleAddModal'
)

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    goals?: TranslatedGoal[]
    sdgs?: number[]
    isInEditingMode?: boolean
  }>(),
  {
    sdgs: () => [],
    goals: () => [],
    isInEditingMode: false,
  }
)

const emit = defineEmits<{ 'reload-goals': [] }>()
const { t } = useNuxtI18n()
const toaster = useToasterStore()

const selectedGoal = ref<TranslatedGoal>()
const { stateModal, closeModal, openModal } = useModal()

const localeDeleteGoal = (goal: TranslatedGoal) => {
  selectedGoal.value = goal
  openModal()
}

const localeCloseGoal = () => {
  selectedGoal.value = null
  closeModal()
}

useScrollToTab()

const { canEditProject } = usePermissions()
const asyncing = ref(false)

const isEditionEnabled = computed(() => canEditProject.value && props.isInEditingMode)

const sortedGoals = computed(() => {
  return props.goals.toSorted((a, b) => {
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
})

const onDeleteGoal = async () => {
  asyncing.value = true
  try {
    await deleteGoal(props.project.id, selectedGoal.value.id)

    emit('reload-goals')

    analytics.goal.removeGoalProject({
      project: {
        id: props.project.id,
      },
      goal: selectedGoal.value,
    })
    toaster.pushSuccess(t('toasts.goal-delete.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.goal-delete.error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
    localeCloseGoal()
  }
}
</script>

<style lang="scss" scoped>
.project-goals {
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
