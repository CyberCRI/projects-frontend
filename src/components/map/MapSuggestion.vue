<template>
  <div class="wrapper">
    <div ref="marker" class="map-pointer">
      <div class="badge" @click="emit('pick-location', location)">
        <div :class="location.type" class="badge__dot" />
        <div class="badge__label">
          {{ location.label }}
        </div>
      </div>

      <div class="line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Geocoding, MapPointerOption } from '@/interfaces/maps'

const props = defineProps<{ location: Geocoding }>()

const emit = defineEmits<{
  mounted: [MapPointerOption]
  unmounted: [Geocoding]
  'pick-location': [Geocoding]
}>()

const markerRef = useTemplateRef('marker')
onMounted(() => {
  emit('mounted', {
    location: props.location,
    markerContent: markerRef.value,
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

.leaflet-marker-icon {
  position: relative;
}

.actions {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  justify-content: flex-end;
  gap: $space-xs;
  z-index: 10;
  transform: translate(0, -50%);
}
</style>
