<template>
  <div v-if="user.researcher" class="domain-list">
    <ResearcherDomain v-for="domain in domains" :key="domain.id" :domain="domain" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = defineProps<{ user: TranslatedUserModel }>()

const domains = computed(() => props.user.researcher?.domains || [])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.domain-list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  align-items: flex-start;
}
</style>
