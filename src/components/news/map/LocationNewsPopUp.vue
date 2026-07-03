<template>
  <CardLocationPopUp
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
import type { AnyTranslatedLocation } from 'shared-projects-frontend/models/location.model'
import type { TranslatedNews } from 'shared-projects-frontend/models/news.model'
import type CardLocationPopUp from '@/components/map/CardLocationPopUp.vue'
import { DEFAULT_NEWS_PATATOID } from '@/composables/usePatatoids'
import { html2Text } from '~/functs/tiptap'

const props = defineProps<{ location: AnyTranslatedLocation; news: TranslatedNews }>()

const description = computed(() => html2Text(props.news.$t.content))
</script>
