<template>
  <div class="location-lists">
    <div
      v-for="(locationsList, locationType) in locationsGrouped"
      :key="locationType"
      class="location-list-wrapper"
    >
      <h3 class="list-title">{{ $t(`location.${locationType}`) }}</h3>
      <ul class="location-list">
        <li v-for="location in locationsList" :key="location.id" class="location">
          <LocationItem
            :location="location"
            :editable="editable"
            @focus="$emit('focus', $event)"
            @delete="$emit('delete', $event)"
            @edit="$emit('edit', $event)"
          />
        </li>
      </ul>
    </div>
    <div v-if="!locations.length" class="location-empty">
      {{ $t('map.empty') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import LocationItem from '@/components/map/LocationItem.vue'
import { TranslatedLocation } from '@/models/location.model'
import { groupBy } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    locations: TranslatedLocation[]
    editable?: boolean
  }>(),
  { editable: true }
)

defineEmits(['edit', 'focus', 'delete'])

const locationsGrouped = computed(() => groupBy(props.locations, (location) => location.type))
</script>

<style lang="scss" scoped>
.location-list {
  list-style: none;
  display: grid;
  margin-top: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media screen and (max-width: $max-tablet) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: 1fr;
  }
}

.location-list-wrapper {
  margin-top: 2rem;
}

.list-title {
  text-transform: uppercase;
  font-size: $font-size-l;
  color: $primary-dark;
  font-weight: 700;
}

.location-empty {
  width: 100%;
  font-style: italic;
  opacity: 0.6;
  text-align: center;
  margin-top: 2rem;
}
</style>
