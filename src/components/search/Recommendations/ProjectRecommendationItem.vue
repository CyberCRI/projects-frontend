<template>
  <li v-if="recommendation" class="recommendation-item">
    <NuxtLink
      class="recommendation"
      :to="{
        name: 'projectSummary',
        params: { slugOrId: recommendation.slug },
      }"
    >
      <CroppedApiImage
        ref="projectImg"
        :alt="`${recommendation?.$t?.title} image`"
        class="img-container"
        :picture-data="recommendation?.header_image"
        picture-size="small"
        default-picture="/placeholders/header_placeholder.png"
      />
      <div class="text-container">
        <span class="project-title">
          {{ recommendation?.$t?.title }}
        </span>
        <span v-if="recommendation.isFeatured" class="is-featured">
          {{ $t('recommendations.is-featured') }}
        </span>
      </div>
    </NuxtLink>
  </li>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'

export default {
  name: 'ProjectRecommendationItem',

  components: { CroppedApiImage },

  props: {
    recommendation: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.recommendation-item {
  padding-inline: $space-m;
  cursor: pointer;

  &:hover {
    background: $primary-lighter;
  }
}

.recommendation {
  margin: $space-m 0;
  display: flex;
  align-items: center;
  padding: $space-s;

  &--spacer {
    padding: $space-s 16px;
  }
}

.img-container {
  border-radius: $border-radius-s;
  background-size: cover;
  background-position: top center;
  width: 50px;
  height: 50px;
  flex: none;
  margin-right: $space-s;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.project-title {
  font-weight: 700;
  font-size: $font-size-m;
  color: $primary-dark;
  line-height: $line-height-tight;
}

.is-featured {
  font-size: $font-size-s;
  color: $primary-dark;
}
</style>
