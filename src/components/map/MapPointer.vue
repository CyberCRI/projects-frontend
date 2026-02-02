<template>
  <div class="wrapper">
    <div ref="marker" class="map-pointer" :data-location-type="location.type">
      <slot name="marker">
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
      </slot>
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
import { AnyLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: AnyLocation
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  mounted: [MapPointerOption]
  unmounted: [AnyLocation | null]
  edit: [AnyLocation | null]
}>()

const markerRef = useTemplateRef('marker')
const tooltipRef = useTemplateRef('tooltip')

onMounted(() => {
  emit('mounted', {
    location: props.location,
    markerContent: markerRef.value,
    tooltip: tooltipRef.value.childElementCount ? tooltipRef.value : null,
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
