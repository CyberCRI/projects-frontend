<template>
  <div class="project-tooltip">
    <div class="project-tooltip__header">
      <div :class="location.type" class="project-tooltip__header--dot" />
      <h2 class="project-tooltip__header--title">
        {{ capitalize(typeLabel) }}
      </h2>
    </div>

    <div class="project-tooltip__location">
      <h3 class="project-tooltip__location--title">
        {{ capitalize(location.title) }}
      </h3>
      <p class="project-tooltip__location--description">
        {{ capitalize(location.description) }}
      </p>

      <LinkButton
        :label="capitalize($t('project.view'))"
        class="project-tooltip__button"
        btn-icon="ArrowRight"
        :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
      />
    </div>

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
  </div>
</template>

<script setup>
import { capitalize } from 'es-toolkit'

import LinkButton from '@/components/base/button/LinkButton.vue'
import { cropIfTooLong } from '@/functs/string'

defineOptions({ name: 'ProjectTooltip' })

const props = defineProps({
  location: {
    type: Object,
    default: () => {},
  },
})

const { t } = useNuxtI18n()
const project = computed(() => {
  return props.location.project
})
const typeLabel = computed(() => {
  return props.location.type === 'impact' ? t('project.impact') : t('team.team')
})
const title = computed(() => {
  return cropIfTooLong(project.value.title, 45)
})
const purpose = computed(() => {
  return cropIfTooLong(project.value.purpose, 85)
})
</script>

<style lang="scss" scoped>
.project-tooltip {
  overflow: hidden;
  display: flex;
  width: 100%;
  height: 100%;
  transition: opacity 0.15s ease-in-out;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: flex-start;
    padding: $space-s;

    &--title {
      color: $primary-dark;
      font-weight: 700;
      font-size: $font-size-s;
    }

    &--dot {
      width: pxToRem(16px);
      height: pxToRem(16px);
      border-radius: 50%;
      margin-right: $space-s;

      &.impact {
        background: $violet;
      }

      &.team {
        background: $primary;
      }
    }
  }

  &__location {
    padding: $space-s;

    &--title {
      font-weight: 500;
      font-size: $font-size-xl;
    }

    &--description {
      font-weight: 400;
      font-size: $font-size-m;
    }
  }

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

.icon {
  width: pxToRem(18px);
  height: pxToRem(18px);

  &--close {
    background: $primary-dark;
    fill: $white;
    border-radius: 50%;
  }
}
</style>
