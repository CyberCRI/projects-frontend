<template>
  <ResearcherTradeList v-if="user.researcher">
    <ResearcherTrade v-for="(need, index) in needs" :key="index" :trade="need" />
  </ResearcherTradeList>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const needs = ref([
  {
    type: 'need',
    label:
      'Looking for a partner with expertise in computational modeling of biological systems for an ANR / ERASMUS+ proposal',
    note: 'Tagada tsouin tsouin',
  },
  {
    type: 'need',
    label: 'Looking for a mentor (Learning transitions)',
    note: null,
  },
  {
    type: 'need',
    label: 'Database dedicated to protein secretion systems',
    note: null,
  },
])
</script>
