<template>
  <NuxtLink
    class="category-card shadow-box"
    :style="{ width: imageWidth }"
    :to="{ name: 'Category', params: { id: category?.id } }"
  >
    <CategoryCardImage
      :background-color="category.background_color"
      :image-height="imageHeight"
      :image-width="imageWidth"
      :url="imageSource"
      :image-sizes="imageSizes"
      class="category-card-image"
    />

    <div class="title-description-ctn">
      <h3 class="title">
        {{ $filters.capitalize(category.name) }}
      </h3>
      <p class="description" v-html="category.description" />
    </div>
  </NuxtLink>
</template>

<script>
import CategoryCardImage from '@/components/category/CategoryCardImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
  name: 'CategoryCard',

  components: {
    CategoryCardImage,
  },

  props: {
    category: {
      type: Object,
      required: true,
    },
  },

  computed: {
    imageWidth() {
      return '288px'
    },

    imageHeight() {
      return '76px'
    },

    imageSource() {
      return this.category?.background_image?.variations?.small || null
    },
    imageSizes() {
      const bgImage = this.category?.background_image
      return (bgImage && pictureApiToImageSizes(bgImage)) || null
    },
  },
}
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
