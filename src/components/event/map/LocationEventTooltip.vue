<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('event.view')"
    :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
    :title="news.$t.title"
    :description="description"
  />
</template>

<script setup lang="ts">
import { TranslatedEventLocation } from '@/models/location.model'
import CardLocationTooltip from '@/components/map/CardLocationTooltip.vue'
import { html2Text } from '@/functs/string'
import { TranslatedEventModel } from '@/models/event.model'

const props = defineProps<{ location: TranslatedEventLocation; news: TranslatedEventModel }>()

const description = computed(() => html2Text(props.news.$t.content))
</script>
