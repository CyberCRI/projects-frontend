<template>
  <IconImage
    v-if="btnIcon && btnIcon !== 'LoaderSimple'"
    :name="btnIcon"
    class="btn-icon skeletons-background"
  />
  <LoaderSimple
    v-if="btnIcon && btnIcon === 'LoaderSimple'"
    class="btn-icon loader skeletons-background"
  />

  <span
    v-if="label"
    data-test="button-label"
    class="label skeletons-text"
    :class="{ 'no-text-transform': noTextTransform }"
  >
    {{ label }}
  </span>
</template>
<script setup lang="ts">
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    label?: string
    btnIcon?: IconImageChoice | 'LoaderSimple'
    noTextTransform?: boolean
  }>(),
  {
    label: null,
    btnIcon: null,
    noTextTransform: false,
  }
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.label {
  display: inline-block;
  text-transform: lowercase;

  &::first-letter {
    text-transform: capitalize;
  }

  &.no-text-transform {
    text-transform: none;

    &::first-letter {
      text-transform: none;
    }
  }
}

.btn-icon {
  height: var(--btn-icon-size, variables.pxtorem(18px));
}

.loader-simple {
  width: 22px;
  height: 22px;

  path {
    fill: variables.$primary-dark;
  }
}
</style>
