<template>
  <div class="news-container">
    <div class="news-header">
      <CroppedApiImage
        :alt="`${news.title} image`"
        class="news-image skeletons-background"
        :ratio="2"
        :picture-data="news.header_image"
        :default-picture="DEFAULT_NEWS_PATATOID"
      />
      <div class="news-infos">
        <h1 class="news-title skeletons-text">
          {{ news.$t.title }}
        </h1>
        <time :datetime="news.publication_date" class="skeletons-text">
          {{ publicationDate }}
        </time>
      </div>
    </div>
    <div class="skeletons-text">
      <TipTapOutput class="news-content" :content="news.$t.content" />
    </div>

    <MapRecap v-if="news?.location" :locations="[news.location]" />
  </div>
</template>
<script setup lang="ts">
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_NEWS_PATATOID } from '@/composables/usePatatoids'
import { TranslatedNews } from '@/models/news.model'

const props = defineProps<{ news: TranslatedNews }>()

const { locale } = useNuxtI18n()

const publicationDate = computed(() => {
  const date = props.news.publication_date
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
  })
})
</script>

<style lang="scss" scoped>
.news-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.news-header {
  display: grid;
  grid-template-columns: 240px 1fr;

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: unset;
    grid-template-rows: 240px 1fr;
  }
}

.news-image {
  border-radius: $border-radius-l;
  aspect-ratio: 1;
  margin: auto;
  width: 100%;
  height: auto;

  @media screen and (max-width: $min-tablet) {
    width: auto;
    height: 100%;
  }
}

.news-infos {
  padding: 0 1rem;
  gap: 0.3rem;
  display: flex;
  flex-direction: column;
}

.news-title {
  font-size: xx-large;
}
</style>
