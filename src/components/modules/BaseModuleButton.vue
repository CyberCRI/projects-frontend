<template>
  <component :is="is" :to="to" :class="{ 'icon-only': iconOnly }" type="button" class="link-button">
    <ButtonContent :label="label" :btn-icon="btnIcon" :no-text-transform="noTextTransform" />
    <!-- <IconImage name="" /> -->
  </component>
</template>

<script setup lang="ts">
import type { IconImageChoice } from '~/functs/IconImage'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    to?: RouteLocationRaw
    btnIcon?: IconImageChoice | 'LoaderSimple'
    noTextTransform?: boolean
  }>(),
  {
    label: null,
    to: null,
    btnIcon: null,
    noTextTransform: false,
  }
)

const is = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  return 'button'
})

const iconOnly = computed(() => (!props.label || !props.label.length) && props.btnIcon)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.link-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  transition: 0.15s all ease-in-out;
  cursor: pointer;
  will-change: transform;
  border: none;
  background: transparent;
  color: variables.$primary-dark;
  padding: 0;
  gap: variables.$space-m;
  font-size: 1rem;

  &.icon-only {
    border-radius: 50%;
    width: 42px;
    height: 42px;
    padding: 0;
  }
}

.link-button :deep(svg) {
  transition: 0.15s fill ease-in-out;
  width: 1.4em;
  height: 1.4em;
  fill: variables.$primary;
}
</style>
