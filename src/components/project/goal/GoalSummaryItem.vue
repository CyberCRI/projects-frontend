<template>
  <div class="goal">
    <div
      v-if="statusIconVisible"
      :class="{ completed: goal.status === 'complete', ongoing: goal.status === 'ongoing' }"
      class="status-ctn"
    >
      <span class="status skeletons-text">{{ goal.status }}</span>
    </div>

    <div class="goal-title skeletons-text">
      {{ goal.$t.title }}
    </div>

    <div v-if="deadlineAt" class="deadline skeletons-text">
      {{ deadlineAt }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedGoal } from '@/models/goal.model'
import { formatDate } from '@/functs/date'

const props = defineProps<{
  goal: TranslatedGoal
}>()

const { locale } = useNuxtI18n()

const statusIconVisible = computed(() => {
  return props.goal.status && props.goal.status !== 'na' && props.goal.status !== 'cancel'
})

const deadlineAt = computed(() =>
  props.goal.deadline_at ? formatDate(props.goal.deadline_at, locale.value) : null
)
</script>

<style lang="scss" scoped>
.goal {
  display: flex;
  overflow: hidden;
  border-radius: $border-radius-m;
  border: $border-width-s solid $primary-dark;
  color: $primary-dark;
  font-weight: bold;
  background: $primary-lighter;

  > div {
    padding: $space-xs;
  }

  .status-ctn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: $border-width-s solid $primary-dark;
    flex: 0 0 10em;

    svg {
      width: pxToRem(10px);
      height: pxToRem(10px);
    }

    &.completed {
      background: $primary;
      color: $white;

      svg {
        fill: $black;
      }
    }

    &.ongoing {
      background: $white;

      svg {
        fill: $black;
      }
    }
  }

  .goal-title {
    text-transform: uppercase;
    font-size: $font-size-2xs;
    display: flex;
    align-items: center;
    width: 100%;
    flex-grow: 1;
  }

  .deadline {
    font-size: $font-size-xs;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: $border-width-s solid $primary-dark;
  }
}
</style>
