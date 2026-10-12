<template>
  <div v-if="user.researcher" class="domain-list">
    <span v-for="domain in domains" :key="domain.id" class="domain-item">
      <PieProgress class="progress" :progress="domain.progress" />
      <span class="domain-label">{{ domain.label }}</span>
    </span>
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
