<template>
  <div class="location-list-item">
    <div class="location-title">
      <h4>{{ location.$t.title }}</h4>
      <p>{{ location.$t.description }}</p>
    </div>
    <ToolTip hover :content="$t('location.focus-on-map')" placement="top">
      <ContextActionButton
        secondary
        no-border
        action-icon="MapMarker"
        @click="$emit('focus', location)"
      />
    </ToolTip>
    <ContextActionMenu
      v-if="editable"
      class="location-actions"
      can-edit
      can-delete
      @edit="$emit('edit', location)"
      @delete="$emit('delete', location)"
    />
  </div>
</template>

<script setup lang="ts">
import { TranslatedLocation } from '@/models/location.model'

withDefaults(
  defineProps<{
    location: TranslatedLocation
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

defineEmits<{
  focus: [TranslatedLocation]
  delete: [TranslatedLocation]
  edit: [TranslatedLocation]
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
