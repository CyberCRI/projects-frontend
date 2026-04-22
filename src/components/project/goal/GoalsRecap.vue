<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="goals-recap">
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
import { getAllGoals } from '@/api/v2/goals.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import GoalSummaryItem from '@/components/project/goal/GoalSummaryItem.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { goalSkeletons } from '@/skeletons/goals.skeletons'

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

<style lang="scss" scoped>
.goals-recap {
  border: $border-width-s solid $primary;
  border-radius: $border-radius-l;
  padding: $space-l;
  background: $primary-lighter;
}

.goals-recap .goal:not(:first-child) {
  margin-top: pxToRem(12px);
}
</style>

<style lang="scss">
.goals-recap .section-header .s-button {
  text-transform: uppercase;
}
</style>
