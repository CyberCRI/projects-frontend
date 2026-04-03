<script setup lang="ts" generic="T extends AnyTranslatedLocation">
import type { LocationType } from '@/models/types'
import LocationTypeComponent from '@/components/map/LocationType.vue'
import { groupBy } from 'es-toolkit'
import IconImage from '@/components/base/media/IconImage.vue'
import { AnyTranslatedLocation } from '@/models/location.model'

const { stateModal, toggleModal } = useModal()

const props = defineProps<{
  locations: T[]
}>()

const { query, toggleQuery } = useQuery<Record<LocationType, boolean>>({
  address: true,
  impact: true,
  team: true,
  news: true,
  event: true,
})

const emit = defineEmits<{
  update: [typeof query]
}>()

const locationLayerGrouped = computed(() => groupBy(props.locations, (item) => item.type))

const enabledFilters = computed(() => Object.keys(locationLayerGrouped.value) as LocationType[])

const pointsCount = computed(() => {
  const layers = toRaw(locationLayerGrouped.value)

  return Object.entries(layers)
    .filter(([locationType]) => query[locationType])
    .reduce((acc, [, location]) => acc + location.type, 0)
})

watchEffect(() => emit('update', toRaw(query)))
</script>

<template>
  <div v-if="enabledFilters.length" class="locationtype-container">
    <div class="menu-header" :class="{ opened: stateModal }">
      <h2 v-show="stateModal">Menu</h2>
      <button :aria-label="$t('common.filter')" @click.stop="toggleModal">
        <IconImage name="Filter" />
      </button>
    </div>

    <form v-if="stateModal" class="list-container">
      <LocationTypeComponent
        v-for="key in enabledFilters"
        :key="key"
        class="scale-hover cursor-pointer"
        :class="{ disabled: !query[key] }"
        :location-type="key"
        @click="toggleQuery(key, true)"
      />

      <EmptyLabel v-if="pointsCount" :label="pointsCount.toString()" />
    </form>
  </div>
</template>

<style lang="scss" scoped>
.menu-header {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;
  width: 100%;

  svg {
    width: 1.5rem;
    fill: rgb(0 0 0 / 50%);
  }

  &:hover svg,
  &.opened svg {
    fill: rgb(0 0 0 / 100%);
  }
}

.locationtype-container {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 0.5rem;
  flex-direction: column;
  border-radius: 0.5rem;
  background-color: white;
  padding: 0.25rem;

  $shadow-hover-def-1: 0 5px 10px rgb(0 0 0 / 12%);
  $shadow-hover-def-2: 0 4px 8px rgb(0 0 0 / 6%);

  box-shadow: $shadow-hover-def-1, $shadow-hover-def-2;
  overflow: hidden;
}

.btn-filter {
  background-color: white;
  border-radius: 100%;
  padding: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;

  svg {
    width: 1.5rem;
    color: black;
    fill: black;
  }

  &:hover {
    transform: scale(1.05);
  }
}

h2 {
  text-align: center;
  width: 100%;
}

.list-container {
  padding: 1rem;
}

.disabled {
  opacity: 0.5;
}
</style>
