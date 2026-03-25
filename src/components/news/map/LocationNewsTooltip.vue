<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('news.view')"
    :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
    :image="news.header_image"
    :default-picture="DEFAULT_NEWS_PATATOID"
    :title="news.$t.title"
    :description="description"
  />
</template>

<script setup lang="ts">
import { AnyTranslatedLocation } from '@/models/location.model'
import { DEFAULT_NEWS_PATATOID } from '@/composables/usePatatoids'
import CardLocationTooltip from '@/components/map/CardLocationTooltip.vue'
import { TranslatedNews } from '@/models/news.model'
import { html2Text } from '@/functs/string'

const props = defineProps<{ location: AnyTranslatedLocation; news: TranslatedNews }>()

const description = computed(() => html2Text(props.news.$t.content))
</script>
