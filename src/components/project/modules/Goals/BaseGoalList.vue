<template>
  <FetchLoader :status="status" only-error skeleton>
    <!-- only for sdgs -->
    <div v-if="!preview">
      <BaseModuleHeader
        :editable="editable"
        :add-label="$t('sdg.add-short')"
        @add="openModals('editSdg')"
      />
      <SdgPreview :sdgs="project.sdgs" />
    </div>

    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    />

    <div class="list-container" :class="{ 'goal-editable': editable }">
      <component
        :is="preview ? GoalSummaryItem : GoalItem"
        v-for="(goal, index) in sortedGoals"
        :key="index"
        :goal="goal"
        class="goal"
        :can-delete="editable"
        :can-edit="editable"
        @delete="onDelete(goal)"
        @edit="onEdit(goal)"
      />
      <NothingHere v-if="sortedGoals.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.goal-confirm-delete')"
    :asyncing="asyncing"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <BlogEntry :blog-entry="selectedGoal" />
  </ConfirmModal>

  <SdgsDrawer
    :model-value="project.sdgs"
    :is-opened="stateModals.editSdg"
    @update:model-value="onUpdateSdgs"
    @close="cancel"
  />

  <GoalDrawer
    :is-opened="stateModals.edit"
    :project="project"
    :goal="selectedGoal"
    @reload="fullRefresh"
    @close="cancel"
  />
</template>

<script setup lang="ts">
import GoalSummaryItem from '~/components/project/modules/Goals/GoalSummaryItem.vue'
import SdgPreview from '~/components/project/modules/Goals/sdg/SdgPreview.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import GoalDrawer from '~/components/project/modules/Goals/GoalDrawer.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import GoalItem from '~/components/project/modules/Goals/GoalItem.vue'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { goalSkeletons } from '@/skeletons/goals.skeletons'
import SdgsDrawer from '~/components/sdgs/SdgsDrawer.vue'
import { patchProject } from '~/api/projects.service'
import { getAllGoals } from '@/api/v2/goals.service'
import { deleteGoal } from '~/api/goals.service'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  { limit: null, preview: false, editable: false }
)

const { t } = useNuxtI18n()

const asyncing = ref(false)
const toaster = useToaster()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.goals, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: goals,
  pagination,
  refresh,
} = getAllGoals(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(goalSkeletons, limitSkeletons.value),
})

const sortedGoals = computed(() => {
  return goals.value.toSorted((a, b) => {
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

const selectedGoal = ref()
const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  edit: false,
  editSdg: false,
  delete: false,
})

const onEdit = (goal) => {
  selectedGoal.value = goal
  openModals('edit')
}

const onDelete = (goal) => {
  selectedGoal.value = goal
  openModals('delete')
}

const cancel = () => {
  asyncing.value = false
  selectedGoal.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteGoal(props.project.id, selectedGoal.value.id)
    .then(() => {
      toaster.pushSuccess(t('toasts.goal.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushSuccess(t('toasts.goal.error')))
    .finally(() => cancel())
}

const onUpdateSdgs = (sdgs: number[]) => {
  patchProject(props.project.id, {
    sdgs,
  })
    .then(() => {
      toaster.pushSuccess(t('toasts.sdgs-update.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.sdgs-update.error')))
    .finally(() => closeModals('editSdg'))
}
</script>

<style lang="scss" scoped>
.list-container.goal-editable {
  gap: 1.5rem;
  margin-top: 1.5rem;
}
</style>
