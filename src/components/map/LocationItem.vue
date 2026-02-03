<template>
  <div class="location-list-item">
    <div class="location-title">
      <LocationType :location="location" />
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <ToolTip v-if="focus" hover :content="$t('location.focus-on-map')" placement="top">
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
import LocationType from '@/components/map/LocationType.vue'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: TranslatedLocation
    editable?: boolean
    focus?: boolean
  }>(),
  {
    editable: false,
    focus: true,
  }
)

defineEmits<{
  focus: [TranslatedLocation]
  delete: [TranslatedLocation]
  edit: [TranslatedLocation]
}>()

// need to safe guard with translated title (if we are in edit/create mode)
const title = computed(() => props.location.$t?.title ?? props.location.title)
const description = computed(() => props.location.$t?.description ?? props.location.description)
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
