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

<script setup>
import { capitalize } from '@/functs/string'

defineOptions({
  name: 'LpiDropDownElementButton',
})
defineEmits(['click'])

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const label = computed(() => {
  const vl = props.option.label ?? props.option.name ?? props.option.value
  return capitalize(vl)
})
</script>

<style lang="scss" scoped>
.drop-down-menu-item-content {
  color: $primary-dark;
  padding: $space-m $space-s;
  font-size: $font-size-s;
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
    font-size: $font-size-m;
  }

  &.selected {
    background-color: $primary-light;
    font-style: italic;
    color: rgba($primary-dark, 0.7);
  }

  &:not(.selected):hover {
    background-color: $primary-light;
    cursor: pointer;
  }
}
</style>
