<script setup lang="ts" generic="T extends Roles">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'

import type { ImageModel } from '~/models/image.model'
import type { Roles } from '~/models/types'

withDefaults(
  defineProps<{
    label: string
    job?: string
    description?: string
    role?: string
    image?: ImageModel
    defaultPicture: string
    icon?: IconImageChoice
    selected?: boolean
    passive?: boolean
    minimal?: boolean
  }>(),
  {
    job: null,
    description: null,
    role: null,
    image: null,
    icon: null,
    selected: false,
    passive: false,
    minimal: false,
  }
)
</script>

<template>
  <div
    class="card-small"
    :class="{ selected: selected, passive: passive, fit: minimal }"
    :title="label"
  >
    <div class="card-container">
      <CroppedApiImage
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
.card-small {
  display: flex;
  align-items: center;
  padding: $space-s;
  box-sizing: border-box;
  border: $border-width-s solid var(--primary);
  border-radius: $border-radius-m;
  background-color: $white;
  height: pxToRem(70px);
  color: var(--black);
  position: relative;
  justify-content: space-between;
  cursor: pointer;
  width: pxToRem(240px);

  &.fit {
    height: fit-content;
    width: fit-content;
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
    width: pxToRem(48px);
    height: pxToRem(48px);
    flex-shrink: 0;
  }

  .card-info {
    margin-left: $space-m;
    flex-grow: 1;

    &.minimal {
      display: none;
    }
    &:hover {
      display: block;
    }

    .title {
      font-size: $font-size-xs;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
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
    width: pxToRem(20px);
    height: pxToRem(20px);
    position: absolute;
    right: 4px;
    top: 4px;
    border-radius: $border-radius-50;
    cursor: pointer;

    &--selected {
      background: var(--primary-dark);
      fill: $white;
    }
  }

  .name {
    font-weight: 700;
    font-size: $font-size-s;
    margin-bottom: $space-s;
  }

  .role {
    background: var(--primary);
    color: $black;
    font-size: $font-size-s;
    font-weight: 700;
    display: inline-block;
    padding: $space-2xs $space-xs;
    margin-bottom: $space-m;
  }
}

.selected {
  background: var(--primary-lighter);
}
</style>
