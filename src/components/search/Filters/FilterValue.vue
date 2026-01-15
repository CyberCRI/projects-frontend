<template>
  <div :class="type" class="filter-value" :data-test="`filter-value-${label}`">
    <div class="filter-value-label">
      {{ label }}
    </div>

    <span v-if="icon" class="icon-ctn">
      <IconImage :name="icon" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { IconImageChoice } from '@/functs/IconImage'
import IconImage from '@/components/base/media/IconImage.vue'

withDefaults(defineProps<{ label?: string; icon?: IconImageChoice; type?: string }>(), {
  label: '',
  type: '',
  icon: null,
})
</script>

<style lang="scss" scoped>
$filter-value-icon-size: 16px;

.filter-value {
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-l;
  overflow: hidden;
  box-sizing: border-box;
  min-width: 40px;
  background: $white;
  padding: $space-s $space-m;

  .filter-value-label {
    text-transform: uppercase;
    font-size: $font-size-s;
    font-weight: 700;
    color: $primary-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .icon-ctn {
    flex-shrink: 0;
    margin-left: $space-m;
    display: inline-block;
    width: pxToRem($filter-value-icon-size);
    height: pxToRem($filter-value-icon-size);
    background: $primary-dark;
    position: relative;
    border: $border-width-m solid $primary-dark;
    border-radius: 100%;

    svg {
      width: pxToRem($filter-value-icon-size);
      fill: $white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &.suggested {
    border: $border-width-s solid $primary;

    .filter-value-label {
      font-weight: 400;
    }
  }

  &.actionable {
    cursor: pointer;
  }
}
</style>
