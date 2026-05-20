<script setup lang="ts">
import { usePublicURL } from '~/composables/usePublic'

defineProps<{
  label?: string
}>()

const SRC = usePublicURL(`/empties/emptyBox.svg`)
</script>

<template>
  <div class="card-list__empty">
    <p class="card-list__empty--text skeletons-text">
      {{ label ?? $t('project.nothing') }}
    </p>
    <svg class="card-list__empty--image skeletons-blur">
      <image :xlink:href="SRC" alt="Nothing here" />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.card-list__empty {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.card-list__empty--text {
  font-weight: 400;
  font-size: 22px;
  color: $primary-dark;
  margin-bottom: 24px;
}

.card-list__empty--image {
  // this is the size of the svg
  height: 220px;
  width: 200px;
}
</style>
