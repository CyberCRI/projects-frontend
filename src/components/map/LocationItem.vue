<template>
  <div class="location-list-item">
    <div class="location-title">
      <LocationType v-if="showLocationType" :location-type="location.type" />
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
import { cropIfTooLong } from '@/functs/string'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: TranslatedLocation
    editable?: boolean
    focus?: boolean
    showLocationType?: boolean
    defaultTitle: string
  }>(),
  {
    editable: false,
    focus: true,
    showLocationType: false,
  }
)

defineEmits<{
  focus: [TranslatedLocation]
  delete: [TranslatedLocation]
  edit: [TranslatedLocation]
}>()

// need to safe guard with translated title (if we are in edit/create mode)
const title = computed(() =>
  cropIfTooLong(props.location.$t?.title || props.location.title || props.defaultTitle, 40)
)
const description = computed(() =>
  cropIfTooLong(props.location.$t?.description || props.location.description, 80)
)
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
