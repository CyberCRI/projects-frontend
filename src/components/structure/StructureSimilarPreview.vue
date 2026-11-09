<template>
  <BaseModulePreview v-if="group.structure" title="">
    <template #content>
      <BaseStructureSimilar :group="group" preview />
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
