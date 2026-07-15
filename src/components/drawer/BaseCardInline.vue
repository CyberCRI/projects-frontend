<script setup lang="ts" generic="T extends Roles">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'

import type { ImageModel, Roles } from 'shared-projects-frontend/models'

withDefaults(
  defineProps<{
    label: string
    job?: string
    description?: string
    role?: string
    image?: ImageModel
    defaultPicture?: string
    icon?: IconImageChoice
    selected?: boolean
    passive?: boolean
    minimal?: boolean
    title?: string
  }>(),
  {
    job: null,
    defaultPicture: null,
    description: null,
    role: null,
    image: null,
    icon: null,
    selected: false,
    passive: false,
    minimal: false,
    title: '',
  }
)
</script>

<template>
  <div
    class="card-small"
    :class="{ selected: selected, passive: passive, minimal: minimal }"
    :title="title || label"
  >
    <div class="card-container">
      <CroppedApiImage
        v-if="image || defaultPicture"
        :alt="`${label} image`"
        class="img-container skeletons-background"
        :picture-data="image"
        picture-size="medium"
        :default-picture="defaultPicture"
      />
      <div
        class="card-info text-ellipsis"
        :class="{
          minimal: minimal,
        }"
      >
        <div class="name">
          <LineClamped :line-number="2">
            <span class="skeletons-text">
              {{ label }}
            </span>
          </LineClamped>
        </div>

        <div v-if="role" class="role skeletons-text">
          {{ role }}
        </div>

        <div v-if="job" class="title skeletons-text">
          {{ job }}
        </div>

        <div v-if="description" class="title skeletons-text" v-html="description" />
      </div>
    </div>

    <div v-if="icon" class="icon" :class="{ 'icon--selected': selected }">
      <IconImage :name="icon" class="skeletons-background" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.card-small {
  display: flex;
  align-items: center;
  padding: variables.$space-s;
  box-sizing: border-box;
  border: variables.$border-width-s solid var(--primary);
  border-radius: variables.$border-radius-m;
  background-color: variables.$white;
  height: variables.pxToRem(70px);
  color: var(--black);
  position: relative;
  justify-content: space-between;
  cursor: pointer;
  width: variables.pxToRem(240px);

  &.minimal {
    height: fit-content;
    width: fit-content;

    &:hover .card-info.minimal {
      display: block;
    }
  }

  &.passive {
    cursor: default;
    pointer-events: none;
  }

  .card-container {
    display: flex;
    align-items: center;
  }

  .img-container {
    border-radius: 50%;
    background-size: cover;
    background-position: top center;
    width: variables.pxToRem(48px);
    height: variables.pxToRem(48px);
    flex-shrink: 0;
  }

  .card-info {
    margin-left: variables.$space-m;
    flex-grow: 1;

    &.minimal {
      display: none;
    }

    .title {
      font-size: variables.$font-size-xs;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: normal;
      overflow-wrap: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      line-clamp: 1;
    }
  }

  .lpi-button {
    flex-shrink: 0;
  }

  .icon {
    fill: var(--primary-dark);
    width: variables.pxToRem(20px);
    height: variables.pxToRem(20px);
    position: absolute;
    right: 4px;
    top: 4px;
    border-radius: variables.$border-radius-50;
    cursor: pointer;

    &--selected {
      background: var(--primary-dark);
      fill: variables.$white;
    }
  }

  .name {
    font-weight: 700;
    font-size: variables.$font-size-s;
    margin-bottom: variables.$space-s;
  }

  .role {
    background: var(--primary);
    color: variables.$black;
    font-size: variables.$font-size-s;
    font-weight: 700;
    display: inline-block;
    padding: variables.$space-2xs variables.$space-xs;
    margin-bottom: variables.$space-m;
  }
}

.selected {
  background: var(--primary-lighter);
}
</style>
