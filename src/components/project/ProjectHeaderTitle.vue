<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="42px" tag="h1" />
  <RevealableClamped
    is="h1"
    v-else
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
  loading: boolean
}>()

const capitalizedTitle = computed(() => {
  const title = props.project?.$t?.title
  return capitalize(title)
})

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
<style scoped lang="scss">
.skeleton-block {
  margin-top: 12px;
}
</style>
