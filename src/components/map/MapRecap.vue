<template>
  <GeneralMap
    ref="map"
    class="map-recap"
    :locations="locations"
    :loading="false"
    :editable="editable"
    use-cluster
  >
    <template #controls-top>
      <MapControlExpand v-if="expand" @expand="$emit('expand')" />
    </template>
  </GeneralMap>
</template>

<script setup lang="ts">
import { AnyTranslatedLocation } from '@/models/location.model'
import MapControlExpand from '@/components/map/Control/MapControlExpand.vue'
import GeneralMap from '@/components/map/GeneralMap.vue'

withDefaults(
  defineProps<{
    locations?: AnyTranslatedLocation[]
    editable?: boolean
    expand?: boolean
  }>(),
  {
    locations: () => [],
    expand: false,
    editable: false,
  }
)

const map = useTemplateRef('map')
defineExpose({
  map,
})

defineEmits<{
  expand: []
  edit: [AnyTranslatedLocation]
}>()
</script>
