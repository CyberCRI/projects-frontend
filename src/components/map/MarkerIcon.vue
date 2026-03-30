<script setup lang="ts">
import type { LocationType } from '@/models/types'

withDefaults(defineProps<{ locationType: LocationType; editable?: boolean }>(), {
  editable: false,
})

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="map-pointer">
    <div :class="['badge', locationType]">
      <LocationType :location-type="locationType" />
      <div v-if="editable" class="actions">
        <ContextActionButton action-icon="Pen" class="edit-btn small" @click.stop="emit('edit')" />
      </div>
    </div>
    <div class="line" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: none;
}

.actions {
  display: inline-block;
  margin-left: 1rem;
}
</style>
