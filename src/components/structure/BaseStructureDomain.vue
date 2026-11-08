<template>
  <div v-if="group.structure" class="domain-list" :class="{ 'as-column': preview }">
    <ResearcherDomain v-for="domain in domains" :key="domain.id" :domain="domain" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'

import { getStructureDomains } from '~/api/v2/crisalid.service'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean }>(),
  {
    preview: false,
  }
)

const domainsPreview = computed(() => props.group.structure?.domains || [])

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
