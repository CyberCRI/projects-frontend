<template>
  <ResearcherTradeList v-if="user.researcher">
    <ResearcherTrade
      v-for="(availability, index) in availabilities"
      :key="index"
      :trade="availability"
    />
  </ResearcherTradeList>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const availabilities = ref([
  {
    type: 'availability',
    label: 'Speaker',
    note: null,
  },
  {
    type: 'availability',
    label: 'Open to media requests',
    note: null,
  },
  {
    type: 'availability',
    label: 'External reviewer',
    note: 'Tagada tsouin tsouin',
  },
  {
    type: 'availability',
    label: 'Scientific reviewer',
    note: 'Tagada tsouin tsouin',
  },
  {
    type: 'availability',
    label: 'Editorial boards',
    note: null,
  },
  {
    type: 'availability',
    label: 'Scientific networks',
    note: null,
  },
  {
    type: 'availability',
    label: 'Available for mentoring (System biology)',
    note: null,
  },
  {
    type: 'availability',
    label: 'Career advice',
    note: null,
  },
])
</script>
