<template>
  <LocationTooltip :location="location">
    <LinkButton
      :label="label"
      class="card-tooltip-button"
      btn-icon="ArrowRight"
      :title="label"
      :to="to"
    />
    <div class="card-tooltip-content" :class="[location.type]">
      <CroppedApiImage
        :picture-data="image"
        :default-picture="defaultPicture"
        class="card-tooltip__image"
      />
      <div>
        <h3 class="card-title" :title="props.title">
          {{ title }}
        </h3>
        <p class="card-purpose" :title="props.description">
          {{ description }}
        </p>
      </div>
    </div>
  </LocationTooltip>
</template>

<script setup lang="ts">
import { cropIfTooLong } from '@/functs/string'
import LinkButton from '@/components/base/button/LinkButton.vue'
import { AnyTranslatedLocation } from '@/models/location.model'
import LocationTooltip from '@/components/map/LocationTooltip.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { Image } from '@/models/image.model'

const props = withDefaults(
  defineProps<{
    location: AnyTranslatedLocation
    label: string
    to: any
    title: string
    description?: string
    image: Image
    defaultPicture: string
  }>(),
  { description: '' }
)

const title = computed(() => cropIfTooLong(props.title, 45))
const description = computed(() => cropIfTooLong(props.description, 85))
</script>

<style lang="scss" scoped>
.card-tooltip-button {
  justify-content: start;
}

.card-tooltip-content {
  flex-basis: 60%;
  padding: 1.5rem $space-s;
  background-color: $primary-lighter;
  display: flex;
  justify-content: space-between;

  &.impact {
    background-color: color-mix(in srgb, $location-impact, transparent 90%);
  }

  &.team {
    background-color: color-mix(in srgb, $location-team, transparent 90%);
  }

  .card-title {
    font-size: $font-size-m;
    font-weight: bolder;
  }

  .card-purpose {
    font-size: $font-size-s;
    margin: $space-s 0;
  }
}
</style>
