<template>
  <div v-if="user.researcher" class="domain-list" :class="{ 'as-column': preview }">
    <ResearcherDomain v-for="domain in domains" :key="domain.id" :domain="domain" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  {
    preview: false,
    limit: null,
  }
)

const domainsPreview = computed(() => {
  const doms = props.user.researcher?.domains || []
  if (props.limit) {
    return doms.slice(0, props.limit)
  }
  return doms
})

const domains = computed(() => (props.preview ? domainsPreview.value : domainsPreview.value))
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.domain-list {
  display: flex;
  flex-flow: column-wrap;
  gap: 1rem;
  align-items: flex-start;

  &.as-column {
    flex-flow: column nowrap;
  }
}
</style>
