<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="42px" tag="h1" />
  <RevealableClamped
    v-else
    class="title-block"
    :text-content="capitalizedTitle"
    tag="h1"
    :line-number="2"
    :style-limited="styleLimited"
    :style-full="styleFull"
  />
</template>
<script setup>
import { capitalize } from '@/functs/string'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const capitalizedTitle = computed(() => {
  const title = props.project?.$t?.title
  return capitalize(title)
})

const styleLimited = ref({
  fontWeight: 700,
  fontSize: '32px',
  lineHeight: 1,
  width: '100%',
})

const styleFull = ref({
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
