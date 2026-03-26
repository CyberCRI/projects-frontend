<script setup lang="ts">
import LocationTooltip from '@/components/map/LocationTooltip.vue'
import { LocationGeneral } from '@/interfaces/maps'

const props = defineProps<{
  location: LocationGeneral
}>()
</script>

<template>
  <LocationTooltip :location="location">
    content_id:: {{ location.content_id }} content_type:: {{ location.content_type }}
  </LocationTooltip>
</template>
