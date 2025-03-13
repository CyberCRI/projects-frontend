<template>
  <div :class="{ border: hasBorder }" class="container">
    <span v-if="showLabel" class="level-label"> {{ skillLevels[activeStep - 1]?.label }}</span>
    <span
      v-for="(step, index) in steps"
      :key="index"
      :class="{ 'step-completed': step <= activeStep }"
      class="step"
    />
  </div>
</template>

<script>
import useSkillLevels from '@/composables/useSkillLevels.js'
export default {
  name: 'SkillSteps',

  props: {
    steps: {
      type: Number,
      default: 1,
    },

    activeStep: {
      type: Number,
      default: 1,
    },

    hasBorder: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const { skillLevels } = useSkillLevels()
    return { skillLevels }
  },
}
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
