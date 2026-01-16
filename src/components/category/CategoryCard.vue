<template>
  <NuxtLink
    class="category-card shadow-box"
    :style="{ width: IMAGE_WIDTH }"
    :to="{ name: 'Category', params: { slugOrId: category?.slug || category?.id } }"
  >
    <CategoryCardImage
      :background-color="category.background_color"
      :image-height="IMAGE_HEIGHT"
      :image-width="IMAGE_WIDTH"
      :url="imageSource"
      :image-sizes="imageSizes"
      class="category-card-image"
    />

    <div class="title-description-ctn">
      <div class="title-ctn">
        <h3 class="title">
          {{ capitalize(category?.$t?.name) }}
        </h3>
        <CategoryFollowButton :category-id="category.id" @click.stop.prevent="" />
      </div>
      <p class="description" v-html="category?.$t?.description" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { capitalize } from '@/functs/string'

import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils'
import { TranslatedProjectCategory } from '@/models/project-category.model'

const props = defineProps<{ category: TranslatedProjectCategory }>()

const IMAGE_WIDTH = '288px'
const IMAGE_HEIGHT = '76px'
const imageSource = computed(() => {
  return props.category?.background_image?.variations?.small || null
})

const imageSizes = computed(() => {
  const bgImage = props.category?.background_image
  return (bgImage && pictureApiToImageSizes(bgImage)) || null
})
</script>

<style lang="scss" scoped>
.category-card {
  position: relative;
  cursor: pointer;
  border: $border-width-s solid $primary;
  border-radius: $border-radius-m;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .edit-button {
    position: absolute;
    right: 20px;
    top: -18px;
  }

  .title-description-ctn {
    padding: $space-s $space-m $space-m $space-l;

    .title-ctn {
      display: flex;
      justify-content: space-between;
      gap: $space-m;
      align-items: flex-start;
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
      font-size: $font-size-2xl;
      line-height: $line-height-tight;
      background: $white;
      color: $black;
      border-bottom-left-radius: $border-radius-m;
      border-bottom-right-radius: $border-radius-m;
      flex-grow: 1;
    }

    .description {
      margin-top: pxToRem(16px);
      font-weight: 400;
      font-size: $font-size-m;
      color: $black;
      border-bottom-left-radius: $border-radius-m;
      border-bottom-right-radius: $border-radius-m;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
