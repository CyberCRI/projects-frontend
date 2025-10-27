<template>
  <div class="goals-recap">
    <SectionHeader
      :button-label="$t('common.see-more')"
      :quantity="goals.length"
      :title="$t('goal.goals')"
      class="section-header"
      @redirect-button-clicked="goToGoalPage"
    />

    <div v-if="goals.length" class="goals-ctn">
      <GoalSummaryItem
        v-for="(goal, index) in sortedGoals"
        :key="index"
        :goal="goal"
        class="goal"
        @click="$emit('access-goals-view')"
      />
    </div>
  </div>
</template>

<script setup>
import GoalSummaryItem from '@/components/project/goal/GoalSummaryItem.vue'
import SectionHeader from '@/components/base/SectionHeader.vue'

defineOptions({ name: 'GoalsRecap' })
defineEmits(['access-goals-view'])
const props = defineProps({
  goals: {
    type: Array,
    required: true,
  },
})

const router = useRouter()
const route = useRoute()

const sortedGoals = computed(() => {
  return [...props.goals]
    .sort((a, b) => {
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
    .slice(0, 5) // Limit to 5 goals for display
})

const goToGoalPage = () => {
  router.push({
    name: 'projectGoals',
    params: { slugOrId: route.params.slugOrId },
    hash: '#tab',
  })
}
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
