<template>
  <span class="domain-item">
    <PieProgress class="progress" :progress="progress" />
    <span class="domain-label">{{ title }}</span>
  </span>
</template>
<script lang="ts" setup>
import type { TranslatedResearcherDomain } from 'shared-projects-frontend/models'

const props = defineProps<{ domain: TranslatedResearcherDomain }>()

// TODO: use translation
const title = computed(() => props.domain.domain./*$t.*/ title)
const progress = computed(() => props.domain.level / 100)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.domain-item {
  display: inline-flex;
  align-items: center;
  flex-basis: max-content;
  flex-grow: 0;
  gap: 0.6rem;
  border-radius: 1rem;
  background-color: variables.$primary-lighter;
  padding: 0.4rem 0.8rem;
  color: variables.$primary-dark;
  font-size: 0.8rem;
}

.progress {
  width: 1em;
  height: 1em;
  fill: variables.$primary-dark;
}
</style>
