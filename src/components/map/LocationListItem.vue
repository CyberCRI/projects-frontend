<template>
  <div class="location-list-item">
    <div class="location-title">
      <h4>{{ location.$t.title }}</h4>
      <p>{{ location.$t.description }}</p>
    </div>
    <ContextActionButton
      secondary
      no-border
      action-icon="MapMarker"
      @click="$emit('focus-location', location)"
    />
    <ContextActionMenu
      v-if="isEditable"
      class="location-actions"
      can-edit
      can-delete
      @edit="$emit('edit-location', location)"
      @delete="$emit('delete-location', location)"
    />
  </div>
</template>

<script setup lang="ts">
import { TranslatedLocation } from '@/models/location.model'

withDefaults(
  defineProps<{
    location: TranslatedLocation
    isEditable?: boolean
  }>(),
  {
    isEditable: false,
  }
)

defineEmits<{
  'focus-location': [TranslatedLocation]
  'delete-location': [TranslatedLocation]
  'edit-location': [TranslatedLocation]
}>()
</script>

<style scoped lang="scss">
.location-list-item {
  display: flex;
  background-color: $primary-lighter;
  border-radius: 0.8rem;
  padding: 0.5em;
  align-items: flex-start;
  gap: 1rem;

  .location-title {
    flex-grow: 1;

    h4 {
      font-weight: 600;
    }

    p {
      font-size: 0.8rem;
      font-weight: 300;
    }
  }
}
</style>
