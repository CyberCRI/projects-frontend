<script setup lang="ts">
import type { LocationType } from '@/models/types'

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
.map-pointer {
  --height-line: 35px;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: calc(((var(--height-line) * 2) - 12px) * -1);

  .badge {
    background: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m $space-m $space-m $space-2xs;
    height: 34px;
    box-sizing: border-box;
    border: $border-width-m solid $primary-dark;
    border-radius: $border-radius-l;
    cursor: pointer;
    transition:
      height 0.15s ease-in-out,
      width 0.15s ease-in-out;

    & {
      border-color: var(--location-color);
    }
  }
}

.actions {
  display: inline-block;
  margin-left: 1rem;
}
</style>
