<template>
  <FetchLoader :status="status" only-error skeleton>
    <div v-if="!preview">
      <BaseModuleHeader
        :add="editable"
        :label-add="$t('sdg.add-short')"
        @add="openModals('editSdg')"
      />
      <SdgPreview :sdgs="project.sdgs" />
    </div>

    <BaseModuleHeader
      v-if="!preview"
      :add="editable"
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
      <EmptyLabel v-if="sortedGoals.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.goal-confirm-delete')"
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
    @reload="refreshData"
    @close="cancel"
  />
</template>

<script setup lang="ts">
import GoalSummaryItem from '~/components/project/goal/GoalSummaryItem.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import GoalDrawer from '~/components/project/goal/GoalDrawer.vue'
import SdgPreview from '~/components/project/sdg/SdgPreview.vue'
import type { TranslatedProject } from '@/models/project.model'
import GoalItem from '~/components/project/goal/GoalItem.vue'
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

const toaster = useToaster()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.goals, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: goals,
  pagination,
  key,
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
  selectedGoal.value = null
  closeAllModals()
}

const refreshProjectData = (keys?: string[]) => {
  refreshNuxtData([
    `${organizationCode}::project::${props.project.id}`,
    `${organizationCode}::project::${props.project.slug}`,
    ...(keys ?? []),
  ])
}

const refreshData = () => refreshProjectData([key.value])

const onDeleteConfirm = () => {
  deleteGoal(props.project.id, selectedGoal.value.id)
    .then(() => {
      toaster.pushSuccess(t('toasts.goal.success'))
      refreshData()
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
      refreshProjectData()
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
