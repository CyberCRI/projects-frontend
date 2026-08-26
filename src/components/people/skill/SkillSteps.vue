<template>
  <div :class="{ border: hasBorder }" class="container">
    <IconImage
      v-for="(step, index) in steps"
      :key="index"
      :class="{ 'step-completed': step <= activeStep }"
      class="step"
      :name="step <= activeStep ? 'Star' : 'StarLine'"
      @mouseover.prevent="$emit('mouseover', index + 1)"
      @click="$emit('click', index + 1)"
      @mouseleave.prevent="$emit('mouseleave')"
    />
    <BadgeItem v-if="showLabel" :label="skillLevels[activeStep - 1]?.label" />
  </div>
</template>

<script setup lang="ts">
import useSkillLevels from '~/composables/useSkillLevels'
import { DEFAULT_SKILL_STEPS } from '~/functs/constants'

withDefaults(
  defineProps<{
    steps?: number
    activeStep?: number
    hasBorder?: boolean
    showLabel?: boolean
  }>(),
  {
    steps: DEFAULT_SKILL_STEPS,
    activeStep: 1,
    hasBorder: false,
    showLabel: false,
  }
)
const { skillLevels } = useSkillLevels()

defineEmits<{
  mouseover: [number]
  mouseleave: []
  click: [number]
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.container {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.border {
  border: variables.$border-width-l solid variables.$primary-dark;
  border-radius: 25px;
}

.step {
  height: 1.4rem;
  width: 1.4rem;
  display: inline-block;
  fill: variables.$primary-dark;
}

.level-label {
  padding-right: variables.$space-m;
}

.step:last-child {
  margin-right: 0;
}
</style>
