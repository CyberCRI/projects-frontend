<template>
  <div class="location-tooltip" :class="location.type">
    <div class="location-tooltip-header">
      <LocationType :location-type="location.type" />
      <LpiButton
        btn-icon="Close"
        class="location-tooltip-icon"
        :title="$t('common.close')"
        @click="closePopUp"
      />
    </div>

    <div v-if="title || description" class="location-tooltip-info">
      <h3>
        {{ title }}
      </h3>
      <p>
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import LocationType from '@/components/map/LocationType.vue'
import { cropIfTooLong } from '@/functs/string'
import { AnyLocation } from '@/models/location.model'

const props = defineProps<{ location: AnyLocation }>()

// when create new point (from locationDrawer) we not have $t
const title = computed(() => cropIfTooLong(props.location?.$t?.title ?? props.location.title, 45))
const description = computed(() =>
  cropIfTooLong(props.location?.$t?.description ?? props.location.description, 85)
)

const closePopUp = inject('closePopUp')
</script>

<style lang="scss" scoped>
.location-tooltip {
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.2rem;
  transition: opacity 0.15s ease-in-out;
  border: $border-width-l solid;
  border-radius: $border-radius-m;

  &.impact {
    border-color: $location-impact;
  }

  &.team {
    border-color: $location-team;
  }

  &.address {
    border-color: $location-address;
  }

  > * {
    padding: 0 1rem;
  }

  > *:first-child {
    padding: 1rem;
  }
}

.location-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.location-tooltip-icon {
  width: 22px !important;
  height: 22px !important;
}

.location-tooltip-info {
  h3 {
    font-size: large;
  }
}
</style>
