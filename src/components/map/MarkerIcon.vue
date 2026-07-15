<script setup lang="ts">
import type { LocationType } from 'shared-projects-frontend/models'

withDefaults(defineProps<{ locationType: LocationType; editable?: boolean }>(), {
  editable: false,
})

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <div :data-test="`marker-icon-${locationType}`" class="map-pointer">
    <div :class="['badge', locationType]">
      <LocationType :location-type="locationType" />
      <div v-if="editable" class="actions">
        <ContextActionButton action-icon="Pen" class="edit-btn small" @click.stop="emit('edit')" />
      </div>
      <slot />
    </div>
    <div class="marker-line" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.map-pointer {
  --height-line: 35px;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: calc(((var(--height-line) * 2) - 12px) * -1);

  .badge {
    background: variables.$white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: variables.$space-m variables.$space-m variables.$space-m variables.$space-2xs;
    height: 34px;
    box-sizing: border-box;
    border: variables.$border-width-m solid variables.$primary-dark;
    border-radius: variables.$border-radius-l;
    cursor: pointer;
    transition:
      height 0.15s ease-in-out,
      width 0.15s ease-in-out;
    border-color: var(--location-color);
  }
}

.actions {
  display: inline-block;
  margin-left: 1rem;
}
</style>
