<template>
  <div :class="{ border: hasBorder }" class="container">
    <span v-if="showLabel" class="level-label">{{ skillLevels[activeStep - 1]?.label }}</span>
    <span
      v-for="(step, index) in steps"
      :key="index"
      :class="{ 'step-completed': step <= activeStep }"
      class="step"
    />
  </div>
</template>

<script setup lang="ts">
import useSkillLevels from '~/composables/useSkillLevels'

withDefaults(
  defineProps<{
    steps?: number
    activeStep?: number
    hasBorder?: boolean
    showLabel?: boolean
  }>(),
  {
    steps: 1,
    activeStep: 1,
    hasBorder: false,
    showLabel: false,
  }
)
const { skillLevels } = useSkillLevels()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.container {
  display: inline-flex;
  padding: variables.$space-m calc(variables.$space-l / 1.5);
  align-items: center;
}

.border {
  border: variables.$border-width-l solid variables.$primary-dark;
  border-radius: 25px;
}

.step {
  height: 10px;
  width: 10px;
  margin-right: 8px;
  background-color: variables.$white;
  border: variables.$border-width-m solid variables.$primary-dark;
  border-radius: 50%;
  display: inline-block;
}

.level-label {
  padding-right: variables.$space-m;
}

.step-completed {
  background-color: variables.$primary-dark;
}

.step:last-child {
  margin-right: 0;
}
</style>
