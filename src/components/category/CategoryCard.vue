<template>
  <NuxtLink
    class="category-card shadow-box"
    :style="{ width: IMAGE_WIDTH }"
    :to="{
      name: 'Category',
      params: { slugOrId: category.slug || category.id },
    }"
  >
    <CategoryCardImage
      :background-color="category.background_color"
      :image-height="IMAGE_HEIGHT"
      :image-width="IMAGE_WIDTH"
      :url="imageSource"
      :image-sizes="imageSizes"
      class="category-card-image skeletons-background"
    />

    <div class="title-description-ctn">
      <div class="title-ctn">
        <h3 class="title skeletons-text">
          {{
            // @ts-expect-error TS2339 (translate category or not transalted ?)
            category.$t?.name ?? category.name
          }}
        </h3>
        <CategoryFollowButton :category="category" @click.stop.prevent="" />
      </div>
      <p
        class="description skeletons-text"
        v-html="
          //@ts-expect-error TS2339 (translate category or not transalted ?)
          category.$t?.description ?? category.name
        "
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type {
  ProjectCategoryModel,
  TranslatedProjectCategory,
} from 'shared-projects-frontend/models'

import CategoryCardImage from '~/components/category/CategoryCardImage.vue'

import { pictureApiToImageSizes } from '~/functs/imageSizesUtils'

// TODO: many components use this withtout translated Category
const props = defineProps<{
  category: ProjectCategoryModel | TranslatedProjectCategory
}>()

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
@use '~/design/scss/variables';

.category-card {
  position: relative;
  cursor: pointer;
  border: variables.$border-width-s solid var(--primary);
  border-radius: variables.$border-radius-m;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .edit-button {
    position: absolute;
    right: 20px;
    top: -18px;
  }

  .title-description-ctn {
    padding: variables.$space-s variables.$space-m variables.$space-m variables.$space-l;

    .title-ctn {
      display: flex;
      justify-content: space-between;
      gap: variables.$space-m;
      align-items: flex-start;
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700;
      font-size: variables.$font-size-2xl;
      line-height: variables.$line-height-tight;
      background: variables.$white;
      color: variables.$black;
      border-bottom-left-radius: variables.$border-radius-m;
      border-bottom-right-radius: variables.$border-radius-m;
      flex-grow: 1;
    }

    .description {
      margin-top: variables.pxtorem(16px);
      font-weight: 400;
      font-size: variables.$font-size-m;
      color: variables.$black;
      border-bottom-left-radius: variables.$border-radius-m;
      border-bottom-right-radius: variables.$border-radius-m;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
