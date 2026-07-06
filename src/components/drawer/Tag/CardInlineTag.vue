<script setup lang="ts">
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'
import type { TranslatedTag } from 'shared-projects-frontend'

const props = defineProps<{
  tag: TranslatedTag
}>()

const attrs = useAttrs()

const title = computed(() => `${props.tag.$t.title}\n\n${props.tag.$t.description}`.trim())
</script>

<template>
  <BaseCardInline
    :label="tag.$t.title"
    :description="tag.$t.description"
    :title="title"
    v-bind="attrs"
  />
</template>
