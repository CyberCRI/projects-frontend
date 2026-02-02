<template>
  <div class="wrapper">
    <div ref="marker" class="map-pointer" :data-location-type="location.type">
      <div :class="['badge', location.type]">
        <LocationType :location="location" />
        <div v-if="editable" class="actions">
          <ContextActionButton
            action-icon="Pen"
            class="edit-btn small"
            @click.stop="emit('edit', location)"
          />
        </div>
      </div>

      <div class="line" />
    </div>
    <div ref="tooltip">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import LocationType from '@/components/map/LocationType.vue'
import { MapPointerOption } from '@/interfaces/maps'
import { TranslatedLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: TranslatedLocation
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  mounted: [MapPointerOption]
  unmounted: [TranslatedLocation | null]
  edit: [TranslatedLocation | null]
}>()

const markerRef = useTemplateRef('marker')
const tooltipRef = useTemplateRef('tooltip')
onMounted(() => {
  emit('mounted', {
    location: props.location,
    markerContent: markerRef.value,
    tooltip: tooltipRef.value,
  })
})

onUnmounted(() => {
  emit('unmounted', props.location)
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: none;
}

.actions {
  display: inline-block;
  margin-left: 1rem;
}
</style>
