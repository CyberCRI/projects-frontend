<script setup lang="ts">
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'
import type { TranslatedTag } from '~/models/tag.model'

defineProps<{
  tag: TranslatedTag
}>()

const attrs = useAttrs()
</script>

<template>
  <BaseCardInline :label="tag.$t.title" :description="tag.$t.description" v-bind="attrs" />
</template>
