<script setup lang="ts">
import { AnyLocation } from '@/models/location.model'

const props = withDefaults(defineProps<{ location: AnyLocation; editable?: boolean }>(), {
  editable: false,
})

const emit = defineEmits<{
  edit: [AnyLocation | null]
}>()
</script>

<template>
  <div class="map-pointer">
    <div :class="['badge', location.type]">
      <LocationType :location-type="location.type" />
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
