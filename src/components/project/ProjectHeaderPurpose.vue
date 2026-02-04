<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
  <RevealableClamped
    v-else
    class="purpose-block"
    :text-content="capitalizedPurpose"
    tag="h4"
    :line-number="3"
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

const capitalizedPurpose = computed(() => {
  const purpose = props.project?.$t?.purpose
  return capitalize(purpose)
})

const styleLimited = ref({
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.1,
  width: '100%',
})

const styleFull = ref({
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
