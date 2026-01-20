<template>
  <BaseGroupPreview v-if="group.$t.description" :title="$t('group.similars')">
    <template #content></template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>

<style scoped></style>
