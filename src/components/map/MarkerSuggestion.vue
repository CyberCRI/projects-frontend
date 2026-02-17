<template>
  <div class="badge marker-suggestion">
    <p class="badge__label">
      {{ location.title }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AnyLocation } from '@/models/location.model'

defineProps<{
  location: AnyLocation
}>()
</script>

<style lang="scss" scoped>
.marker-suggestion {
  font-size: large;
  height: auto !important;
  padding: 0.75rem !important;
  max-width: 200px;

  .badge__label {
    color: $primary-dark;
  }
}
</style>
