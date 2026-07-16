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
          class="card-tooltip-content-image skeletons-background"
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
import type { AnyTranslatedLocation, ImageModel } from 'shared-projects-frontend/models'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import LinkButton from '~/components/base/button/LinkButton.vue'
import LocationPopUp from '@/components/map/LocationPopUp.vue'
import type { RouteLocationRaw } from 'vue-router'
import { cropIfTooLong } from '@/functs/string'

const props = withDefaults(
  defineProps<{
    location: AnyTranslatedLocation
    label: string
    to: RouteLocationRaw
    title: string
    description?: string
    image?: ImageModel
    defaultPicture?: string
  }>(),
  { description: '', image: null, defaultPicture: null }
)

const title = computed(() => cropIfTooLong(props.title, 45))
const description = computed(() => cropIfTooLong(props.description, 85))
const haveImage = computed(() => props.image || props.defaultPicture)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.card-tooltip-button {
  justify-content: start;
}

.card-tooltip-content {
  flex-basis: 100%;
  display: flex;
  padding: 1.5rem variables.$space-s;
  background-color: color-mix(in srgb, var(--location-color), transparent 90%);

  &-image,
  &-image img {
    width: variables.pxtorem(72px);
    flex-basis: variables.pxtorem(72px);
    flex-shrink: 0;
    height: variables.pxtorem(72px);
    background-position: center center;
    background-size: cover;
    border-radius: variables.$border-radius-xs;
    object-fit: cover;
    object-position: 50% 50%;
    margin-right: variables.$space-m;
  }

  .card-title {
    font-size: variables.$font-size-m;
    font-weight: bolder;
  }

  .card-purpose {
    font-size: variables.$font-size-s;
    margin: variables.$space-s 0;
  }
}
</style>
