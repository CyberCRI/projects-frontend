<template>
  <div v-if="user.researcher" class="domain-list">
    <ResearcherDomain v-for="domain in domains" :key="domain.id" :domain="domain" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const domains = ref([
  { id: 1, label: 'Neuronal Morphogenesis', progress: 1 },
  { id: 2, label: 'SYSTEM BIOLOGY', progress: 1 },
  { id: 3, label: 'SYNTHETIC BIOLOGY', progress: 1 },
  { id: 4, label: 'Autism Spectrum Disorders (ASD)', progress: 0.8 },
  { id: 5, label: 'Neurodevelopmental Disorders (ND)', progress: 0.6 },
])
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
