<template>
  <div :class="[type, { border }]" class="snackbar">
    <IconImage v-if="icon" class="left-icon" :name="icon" />

    <slot />

    <span v-if="closable" @click="close">
      <IconImage class="close-icon" name="Close" />
    </span>
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    type?: 'success' | 'info' | 'error' | 'warning' | ''
    icon?: IconImageChoice
    closable?: boolean
    border?: boolean
  }>(),
  {
    type: '',
    icon: null,
    closable: false,
    border: false,
  }
)

const emit = defineEmits<{ close: [] }>()
const close = () => emit('close')
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.snackbar {
  padding: variables.$space-m;
  border-radius: variables.$border-radius-s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: variables.$black;
  box-shadow: 0 4px 4px rgb(0 0 0 / 15%);
  max-width: variables.pxToRem(740px);

  &.success,
  &.info {
    background: variables.$primary-light;
  }

  &.error {
    background: variables.$salmon;
  }

  &.warning {
    background: variables.$yellow;
  }

  .left-icon {
    margin-right: variables.$space-m;
    height: variables.$layout-size-xl;
    fill: variables.$black;
  }

  .text {
    margin-right: auto;
    font-size: variables.$font-size-xs;
    font-weight: bold;
  }

  .close-icon {
    cursor: pointer;
    margin-left: 10px;
    height: variables.$layout-size-xl;
    fill: variables.$black;
  }
}
</style>
