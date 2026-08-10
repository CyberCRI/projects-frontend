<template>
  <button
    type="button"
    class="drop-down-menu-item-content"
    :class="{
      selected: selected,
    }"
    :data-test="`project-form-${option.id}`"
    @click="!selected && $emit('click', option)"
  >
    <span class="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { capitalize } from '~/functs/string'

defineEmits(['click'])

export type Option = {
  id: number
  label?: string
  name?: string
  value: string
  children?: Option[]
}

const props = withDefaults(
  defineProps<{
    option: Option
    selected?: boolean
  }>(),
  {
    selected: false,
  }
)

const label = computed(() => {
  const vl = props.option.label ?? props.option.name ?? props.option.value
  return capitalize(vl)
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.drop-down-menu-item-content {
  color: variables.$primary-dark;
  padding: variables.$space-m variables.$space-s;
  font-size: variables.$font-size-s;
  display: flex;
  align-items: center;
  font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;
  border: 0 none;
  appearance: none;
  background-color: white;
  transition: transform 200ms ease-in-out;
  width: auto;

  .label {
    transform-origin: left center;
    font-weight: 400;
    font-size: variables.$font-size-m;
  }

  &.selected {
    background-color: variables.$primary-light;
    color: rgba(variables.$primary-dark, 0.7);
  }

  &:not(.selected):hover {
    background-color: variables.$primary-light;
    cursor: pointer;
  }
}
</style>
