<template>
  <NuxtLink :to="toLink" class="shadow-box">
    <div class="card-container">
      <CroppedApiImage :picture-data="news.header_image" :default-picture="DEFAULT_NEWS_PATATOID" />
      <div class="card-content">
        <h3>
          {{ news.$t.title }}
        </h3>

        <DescriptionCropped :content="news.$t.content" :line="2" />

        <time :datetime="news.publication_date">
          {{ publicationDate }}
        </time>
      </div>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
import DescriptionCropped from '@/components/base/DescriptionCropped.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_NEWS_PATATOID } from '@/composables/usePatatoids'
import { TranslatedNews } from '@/models/news.model'

const props = defineProps<{ news: TranslatedNews; to?: any }>()

const { locale } = useNuxtI18n()

const toLink = computed(() => {
  return {
    name: 'NewsPage',
    ...(props.to || {}),
    params: { slugOrId: props.news.id, ...(props.to?.params || {}) },
  }
})

const publicationDate = computed(() => {
  const date = props.news.publication_date
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
  })
})
</script>

<style lang="scss" scoped>
.card-container {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.5rem;
}
.card-content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.5rem;
}
</style>
