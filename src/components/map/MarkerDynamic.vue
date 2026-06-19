<script setup lang="ts" generic="T extends AnyLocation">
import type { MarkerDynamicInfo } from '@/components/map/MarkerLocationsDynamic.vue'
import type { AnyLocation } from '@/models/location.model'

const props = withDefaults(
  defineProps<{
    location: T
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  click: [T]
  mounted: [T, MarkerDynamicInfo]
  unmounted: [T]
}>()

const markerRef = useTemplateRef('marker')

onUnmounted(() => emit('unmounted', props.location))
onMounted(() => {
  emit('mounted', props.location, {
    marker: markerRef.value,
  })
})
</script>

<template>
  <div class="hidden">
    <div ref="marker" @click="$emit('click', location)">
      <MarkerIcon class="marker-suggestion" :location-type="location.type" :editable="editable">
        <div class="suggestion-info">
          <span v-if="location.title">
            {{ location.title }}
          </span>
          <span v-if="location.description">
            {{ location.description }}
          </span>
        </div>
      </MarkerIcon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.suggestion-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
  font-size: 1rem;
}
</style>

<style lang="scss">
.marker-suggestion {
  .badge {
    flex-direction: column;
    width: 200px;
    padding: 0.25rem !important;
    min-height: 34px !important;
    height: unset !important;
  }
}
</style>
