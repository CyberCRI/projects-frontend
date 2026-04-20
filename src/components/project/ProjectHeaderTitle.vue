<template>
  <RevealableClamped
    is="h1"
    class="title-block"
    :text-content="capitalizedTitle"
    :line-number="2"
    :style-limited="STYLE_LIMITED"
    :style-full="STYLE_FULL"
  />
</template>
<script setup lang="ts">
import { capitalize } from '@/functs/string'
import { TranslatedProject } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
}>()

const capitalizedTitle = computed(() => capitalize(props.project.$t.title))

const STYLE_LIMITED = Object.freeze({
  fontWeight: 700,
  fontSize: '32px',
  lineHeight: 1,
  width: '100%',
})

const STYLE_FULL = Object.freeze({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: 1,
  width: '100%',
})
</script>
