<template>
  <button
    type="button"
    class="drop-down-menu-item-content pointer"
    :class="{
      selected: selected,
    }"
    :data-test="`project-form-${category.id}`"
    @click="emit('choose-category', category)"
  >
    <span class="label">{{ category.$t.name }}</span>
  </button>
</template>

<script setup lang="ts">
import type { TranslatedProjectCategory } from 'shared-projects-frontend/models'

defineProps<{
  category: TranslatedProjectCategory
  selected?: boolean
}>()

const emit = defineEmits(['choose-category'])
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
  transform: translateZ(0);

  .label {
    transform-origin: left center;
    font-weight: 400;
    font-size: variables.$font-size-m;
  }

  &.selected {
    background-color: variables.$primary-light;
    color: rgba(variables.$primary-dark, 0.7);
  }

  &:hover {
    background-color: variables.$primary-light;
    transform: translateZ(0) scaleX(1.1);
  }
}
</style>
