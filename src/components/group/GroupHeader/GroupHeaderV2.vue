<template>
  <div v-if="!isLoading" class="header-group">
    <div class="header-group-image">
      <CroppedApiImage
        :alt="`${title} image`"
        :picture-data="image"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
    </div>
    <div class="header-group-infos">
      <h1 class="header-group-infos__title">
        {{ title }}
      </h1>
      <p v-if="shortDescription" class="short-description" v-html="shortDescription" />
      <div class="header-group-infos__visibility">
        <p>
          <span class="icon">
            <IconImage :name="groupVisibilityIcon" />
          </span>
          <span>
            {{ groupVisibilityLabel }}
          </span>
        </p>
      </div>
    </div>
  </div>
  <GroupHeaderSkeleton v-else />
</template>

<script setup lang="ts">
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import { ImageModel } from '@/models/image.model'

defineOptions({ name: 'GroupHeaderV2' })
const props = withDefaults(
  defineProps<{
    title: string
    image: ImageModel | null
    visibility: string
    isLoading?: boolean
    shortDescription?: string
  }>(),
  { isLoading: false, shortDescription: null }
)

const { t } = useNuxtI18n()

const groupVisibilityLabel = computed(() => {
  if (props.visibility === 'public') {
    return t('group.visibility-public')
  } else if (props.visibility === 'private') {
    return t('group.visibility-private')
  }
  return t('group.visibility-org')
})

const groupVisibilityIcon = computed(() => (props.visibility === 'public' ? 'Eye' : 'EyeSlash'))
</script>

<style lang="scss" scoped>
.header-group {
  background: $primary-lighter;
  padding: calc($space-2xs * 5) calc($space-s * 5);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: $border-radius-l;
  gap: calc($space-s * 5);
  margin-bottom: pxToRem(30px);

  &-image {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 5px solid $white;
    overflow: hidden;
    flex-shrink: 0;

    .cropped-image {
      width: 100%;
      height: 100%;
    }
  }

  &-infos {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: calc($space-2xs * 5);

    &__title {
      font-weight: 700;
      font-size: clamp(2rem, 3vw, 3rem);
      line-height: $line-height-tight;
      color: $black;
    }

    &__visibility {
      p {
        font-weight: 700;
        font-size: $font-size-xs;
        color: $primary-dark;
        display: flex;
        align-items: center;
        gap: $space-s;

        .icon svg {
          fill: $primary-dark;
          width: $layout-size-xl;
          height: $layout-size-m;
        }
      }
    }
  }

  &-options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $space-m;

    .share-ctn button {
      border: none;
      background: white;
    }

    .share-ctn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $space-m;
      z-index: 1;

      svg {
        width: 24px;
        fill: $primary-dark;
        cursor: pointer;
      }
    }
  }
}

.short-description {
  font-weight: 400;
  font-size: $font-size-m;
  margin-bottom: $space-l;
}

@media screen and (max-width: $med-tablet) {
  .header-group {
    flex-direction: column;
    align-items: flex-start;
    gap: calc($space-2xs * 5);
    padding: calc($space-2xs * 5);

    &-image {
      width: 200px;
      height: 200px;
      align-self: center;
    }
  }
}
</style>
