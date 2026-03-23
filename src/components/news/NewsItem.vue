<template>
  <NuxtLink :to="{ name: 'NewsPage', params: { slugOrId: news.id } }">
    <div class="card-container scale-hover">
      <CroppedApiImage
        :picture-data="news.header_image"
        class="card-image skeletons-background"
        :default-picture="DEFAULT_NEWS_PATATOID"
      />
      <div class="card-content">
        <ContextActionMenuInline
          v-if="editable"
          :can-delete="canDeleteNews"
          :can-edit="canEditNews"
          @edit="emit('edit', news)"
          @delete="emit('delete', news)"
        />
        <h3 class="skeletons-text">
          {{ news.$t.title }}
        </h3>

        <DescriptionCropped class="skeletons-text" :content="news.$t.content" :line="2" />

        <time class="skeletons-text" :datetime="news.publication_date">
          {{ publicationDate }}
        </time>
      </div>
    </div>
  </NuxtLink>
</template>
<script setup lang="ts">
import ContextActionMenuInline from '@/components/base/button/ContextActionMenuInline.vue'
import DescriptionCropped from '@/components/base/DescriptionCropped.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_NEWS_PATATOID } from '@/composables/usePatatoids'
import { TranslatedNews } from '@/models/news.model'

const props = withDefaults(defineProps<{ news: TranslatedNews; editable?: boolean }>(), {
  editable: false,
})

const { canEditNews, canDeleteNews } = usePermissions()

const { locale } = useNuxtI18n()

const emit = defineEmits<{
  delete: [TranslatedNews]
  edit: [TranslatedNews]
}>()

const publicationDate = computed(() => {
  const date = props.news.publication_date
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<style lang="scss" scoped>
.card-container {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.5rem;
  border-radius: $border-radius-l;
}

.card-content {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.5rem;
}

.card-image {
  border-radius: $border-radius-l;
  aspect-ratio: 1;
  width: 100%;
  height: auto;
}

.news-item-editable {
  position: absolute;
  pointer-events: all;
  top: 0;
  right: 0;
  margin: -5px;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
