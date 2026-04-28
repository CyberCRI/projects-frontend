<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" tag="h4" />
  <RevealableClamped
    is="h4"
    v-else
    class="purpose-block"
    :text-content="capitalizedPurpose"
    :line-number="3"
    :style-limited="STYLE_LIMITED"
    :style-full="STYLE_FULL"
  />
</template>
<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'

import { capitalize } from '~/functs/string'

const props = defineProps<{
  project: TranslatedProject
  loading: boolean
}>()

const capitalizedPurpose = computed(() => capitalize(props.project?.$t?.purpose))

const STYLE_LIMITED = Object.freeze({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.1,
  width: '100%',
})

const STYLE_FULL = Object.freeze({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.1,
  width: '100%',
})
</script>
<style scoped lang="scss">
.skeleton-block {
  margin-top: 12px;
}
</style>
