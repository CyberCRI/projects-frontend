<template>
  <div :class="type" class="filter-value" :data-test="`filter-value-${label}`">
    <div class="filter-value-label skeletons-text">
      {{ label }}
    </div>

    <span v-if="icon" class="icon-ctn">
      <IconImage :name="icon" class="skeletons-background" />
    </span>
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(defineProps<{ label?: string; icon?: IconImageChoice; type?: string }>(), {
  label: '',
  type: '',
  icon: null,
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$filter-value-icon-size: 16px;

.filter-value {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: variables.$border-width-s solid var(--primary-dark);
  border-radius: variables.$border-radius-l;
  overflow: hidden;
  box-sizing: border-box;
  min-width: 40px;
  background: variables.$white;
  padding: variables.$space-s variables.$space-m;

  .filter-value-label {
    text-transform: uppercase;
    font-size: variables.$font-size-s;
    font-weight: 700;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .icon-ctn {
    flex-shrink: 0;
    margin-left: variables.$space-m;
    display: inline-block;
    width: variables.pxtorem($filter-value-icon-size);
    height: variables.pxtorem($filter-value-icon-size);
    background: var(--primary-dark);
    position: relative;
    border: variables.$border-width-m solid var(--primary-dark);
    border-radius: 100%;

    svg {
      width: variables.pxtorem($filter-value-icon-size);
      fill: variables.$white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &.suggested {
    border: variables.$border-width-s solid variables.$primary;

    .filter-value-label {
      font-weight: 400;
    }
  }

  &.actionable {
    cursor: pointer;
  }
}
</style>
