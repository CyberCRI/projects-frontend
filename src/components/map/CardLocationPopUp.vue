<template>
  <LocationPopUp :location="location">
    <LinkButton
      :label="label"
      class="card-tooltip-button skeletons-background"
      btn-icon="ArrowRight"
      :title="label"
      :to="to"
    />
    <div class="card-tooltip-content" :class="[location.type]">
      <slot>
        <CroppedApiImage
          v-if="haveImage"
          :picture-data="image"
          :default-picture="defaultPicture"
          class="card-tooltip__image skeletons-background"
        />
        <div>
          <h3 class="card-title skeletons-text" :title="props.title">
            {{ title }}
          </h3>
          <p class="card-purpose skeletons-text" :title="props.description">
            {{ description }}
          </p>
        </div>
      </slot>
    </div>
  </LocationPopUp>
</template>

<script setup lang="ts">
import { cropIfTooLong } from '@/functs/string'
import LinkButton from '@/components/base/button/LinkButton.vue'
import { AnyTranslatedLocation } from '@/models/location.model'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { Image } from '@/models/image.model'
import LocationPopUp from '@/components/map/LocationPopUp.vue'

const props = withDefaults(
  defineProps<{
    location: AnyTranslatedLocation
    label: string
    to: any
    title: string
    description?: string
    image?: Image
    defaultPicture?: string
  }>(),
  { description: '', image: null, defaultPicture: null }
)

const title = computed(() => cropIfTooLong(props.title, 45))
const description = computed(() => cropIfTooLong(props.description, 85))
const haveImage = computed(() => props.image || props.defaultPicture)
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

  &.impact {
    background-color: color-mix(in srgb, $location-impact, transparent 90%);
  }

  &.address {
    background-color: color-mix(in srgb, $location-address, transparent 90%);
  }

  &.news {
    background-color: color-mix(in srgb, $location-news, transparent 90%);
  }

  &.team {
    background-color: color-mix(in srgb, $location-team, transparent 90%);
  }

  &.event {
    background-color: color-mix(in srgb, $location-event, transparent 90%);
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
