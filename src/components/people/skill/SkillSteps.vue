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
.container {
  display: inline-flex;
  padding: $space-m calc($space-l / 1.5);
  align-items: center;
}

.border {
  border: $border-width-l solid $primary-dark;
  border-radius: 25px;
}

.step {
  height: 10px;
  width: 10px;
  margin-right: 8px;
  background-color: $white;
  border: $border-width-m solid $primary-dark;
  border-radius: 50%;
  display: inline-block;
}

.level-label {
  padding-right: $space-m;
}

.step-completed {
  background-color: $primary-dark;
}

.step:last-child {
  margin-right: 0;
}
</style>
