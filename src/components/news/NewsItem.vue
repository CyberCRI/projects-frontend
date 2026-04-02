<template>
  <component
    :is="isComponent"
    :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
    class="news-item shadow-box"
  >
    <div class="news-title-ctn mobile">
      <h3 class="news-title skeletons-text">
        {{ news.title }}
      </h3>
      <ContextActionMenuInline
        v-if="editable"
        class="news-item-editable"
        :can-delete="canDeleteNews"
        :can-edit="canEditNews"
        @edit="emit('edit', news)"
        @delete="emit('delete', news)"
      />
    </div>
    <div class="news-img-ctn">
      <CroppedApiImage
        :alt="`${news.$t.title} image`"
        class="picture skeletons-background"
        :ratio="4 / 3"
        :picture-data="news?.header_image"
        picture-size="small"
        default-picture="/patatoids-project/Patatoid-1.png"
      />
    </div>
    <div class="news-texts" :style="textsStyle">
      <div class="news-title-ctn desktop">
        <h3 class="news-title skeletons-text">
          {{ news.$t.title }}
        </h3>

        <ContextActionMenuInline
          v-if="editable"
          class="news-item-editable"
          :can-delete="canDeleteNews"
          :can-edit="canEditNews"
          @edit="emit('edit', news)"
          @delete="emit('delete', news)"
        />
      </div>
      <div class="skeletons-background" :style="style">
        <LineClamped is="p" :line-number="2">
          {{ content }}
        </LineClamped>
      </div>
      <div class="read-more-ctn">
        <SummaryAction class="read-button" :action-label="t('news.list.read-more')" />
      </div>
    </div>
  </component>
</template>
<script setup lang="ts">
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import { TranslatedNews } from '@/models/news.model'
import ContextActionMenuInline from '@/components/base/button/ContextActionMenuInline.vue'
import { html2Text } from '@/functs/string'

const props = withDefaults(
  defineProps<{ news: TranslatedNews; editable?: boolean; is?: string }>(),
  {
    editable: false,
    is: null,
  }
)
const emit = defineEmits<{
  delete: [TranslatedNews]
  edit: [TranslatedNews]
}>()

const isComponent = computed(() => props.is ?? resolveComponent('NuxtLink'))

const { t } = useNuxtI18n()
const { canEditNews, canDeleteNews } = usePermissions()
const style = ref({})
const textsStyle = ref({})

const content = computed(() => html2Text(props.news.$t.content))
</script>
<style scoped lang="scss">
.news-item {
  --news-dimension: 8rem;
  --picture-ratio: calc(4 / 3);

  display: flex;
  align-items: stretch;
  gap: $space-l;
  overflow: hidden;
  padding: $space-s;
  border: $border-width-s solid $lighter-gray;
  border-radius: $border-radius-s;
  flex-direction: column;

  @media screen and (min-width: $min-tablet) {
    flex-direction: row;
    height: var(--news-dimension);
  }
}

.news-img-ctn {
  flex-shrink: 0;
  aspect-ratio: calc(4 / 3);
  width: 100%;

  @media screen and (min-width: $min-tablet) {
    flex-basis: calc(var(--news-dimension) * var(--picture-ratio, 1));
    width: auto;
  }
}

.news-texts {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.5rem;
  width: 100%;

  @media screen and (max-width: $min-tablet) {
    height: 12rem;
  }
}

.news-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.news-title {
  font-size: $font-size-xl;
  line-height: $line-height-tight;
}

@media screen and (min-width: $min-tablet) {
  .mobile {
    display: none;
  }
}

@media screen and (max-width: $min-tablet) {
  .desktop {
    display: none;
  }
}

.read-more-ctn {
  flex-shrink: 0;
  padding-top: 1rem;

  .read-button {
    width: min-content;
    padding-left: 0;
  }
}

.cropped-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: $border-radius-s;
}
</style>
