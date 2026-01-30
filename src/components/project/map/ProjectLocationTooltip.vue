<template>
  <LocationTooltip :location="location">
    <LinkButton
      :label="$t('project.view')"
      class="project-tooltip__button"
      btn-icon="ArrowRight"
      :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
    />
    <div class="project-tooltip__content">
      <img
        :alt="project.header_image?.name"
        loading="lazy"
        :src="project.header_image?.variations?.small"
        class="project-tooltip__image"
      />
      <div>
        <h3 class="project-title">
          {{ title }}
        </h3>
        <p class="project-purpose">
          {{ purpose }}
        </p>
      </div>
    </div>
  </LocationTooltip>
</template>

<script setup lang="ts">
import { cropIfTooLong } from '@/functs/string'
import LinkButton from '@/components/base/button/LinkButton.vue'
import { TranslatedLocation } from '@/models/location.model'
import LocationTooltip from '@/components/map/LocationTooltip.vue'

const props = defineProps<{ location: TranslatedLocation }>()
const project = computed(() => props.location.project)
const title = computed(() => cropIfTooLong(project.value.$t.title, 45))
const purpose = computed(() => cropIfTooLong(project.value.$t.purpose, 85))
</script>

<style lang="scss" scoped>
.project-tooltip {
  &__button {
    padding: initial;
    margin-top: $space-m;
  }

  &__image {
    width: pxToRem(72px);
    flex-basis: pxToRem(72px);
    flex-shrink: 0;
    height: pxToRem(72px);
    background-position: center center;
    background-size: cover;
    border-radius: $border-radius-xs;
    object-fit: cover;
    object-position: 50% 50%;
    margin-right: $space-m;
  }

  &__content {
    flex-basis: 60%;
    padding: $space-s;
    background: $primary-lighter;
    display: flex;
    justify-content: space-between;

    .project-title {
      font-size: $font-size-m;
      font-weight: 700;
    }

    .project-purpose {
      font-size: $font-size-s;
      margin: $space-s 0;
    }
  }
}
</style>
