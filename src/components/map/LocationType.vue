<template>
  <div class="location-header" :class="[locationType]" :title="typeLabel">
    <IconImage
      :name="pointerIcon"
      :class="['location-icon', 'skeletons-background', locationType]"
    />
    <h2 v-if="label" class="location-title skeletons-text">
      {{ typeLabel }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { LOCATION_TYPE_ICON, LOCATION_TYPE_TITLE } from '~/functs/constants'
import type { LocationType } from 'shared-projects-frontend/models'

const props = withDefaults(defineProps<{ locationType: LocationType; label?: boolean }>(), {
  label: true,
})

const { t } = useNuxtI18n()

const typeLabel = computed(() => t(LOCATION_TYPE_TITLE[props.locationType] || ''))
const pointerIcon = computed(() => LOCATION_TYPE_ICON[props.locationType] || 'Alert')
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.location-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .location-icon {
    width: 16px;
    height: 16px;
    padding: 0.3rem;
    border-radius: 100%;
    background-color: var(--location-color);
  }

  .location-title {
    text-transform: uppercase;
  }
}
</style>
