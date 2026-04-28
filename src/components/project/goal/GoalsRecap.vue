<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <GoalSummaryItem
        v-for="(goal, index) in sortedGoals"
        :key="index"
        :goal="goal"
        class="goal"
      />
      <EmptyLabel v-if="sortedGoals.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>

<script setup lang="ts">
import GoalSummaryItem from '@/components/project/goal/GoalSummaryItem.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import type { TranslatedProject } from '@/models/project.model'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { goalSkeletons } from '@/skeletons/goals.skeletons'
import { getAllGoals } from '@/api/v2/goals.service'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    limit?: number
    preview?: boolean
  }>(),
  { limit: null, preview: false }
)

const limitSkeletons = computed(() => maxSkeleton(props.project.modules.goals, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: goals,
  pagination,
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
</script>
