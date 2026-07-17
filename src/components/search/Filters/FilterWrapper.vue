<template>
  <div class="filter-wrapper">
    <div :class="{ toggleable: isToggleable, empty: !hasFilters }" class="header" @click="toggle">
      <slot name="header" />
      <IconImage v-if="isToggleable" class="icon" :name="rightIcon" />
    </div>
    <div v-if="hasFilters" class="body">
      <div class="body-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

const props = withDefaults(
  defineProps<{
    isToggleable?: boolean
    rightIcon?: IconImageChoice
    filterKey: string | number
    hasFilters?: boolean
  }>(),
  { isToggleable: false, rightIcon: 'ChevronRight', hasFilters: true }
)

const emits = defineEmits<{
  'toogle-filter': [(typeof props)['filterKey']]
}>()

const toggle = () => {
  if (props.isToggleable) {
    emits('toogle-filter', props.filterKey)
  }
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.filter-wrapper {
  border-bottom: 1px solid variables.$primary;
}

.filter-wrapper .header {
  font-weight: 500;
  font-size: variables.$font-size-s;
  line-height: variables.$line-height-tight;
  display: flex;
  align-items: center;
  margin-top: variables.pxtorem(16px);
  color: variables.$almost-black;
  justify-content: flex-start;

  &.empty {
    margin-bottom: variables.pxtorem(16px);
  }

  &.toggleable {
    cursor: pointer;
    justify-content: space-between;
  }
}

.filter-wrapper .icon {
  width: 24px;
  fill: #1d727c;
}

.filter-wrapper .body {
  border-top: 0;
  margin: variables.pxtorem(16px) 0;
}

.filter-wrapper .body-inner {
  margin: variables.$space-s 0;
  overflow-wrap: break-word;
}
</style>
