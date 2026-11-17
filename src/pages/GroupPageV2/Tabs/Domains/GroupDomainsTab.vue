<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'
import { BaseStructureDomain } from '#components'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>

<template>
  <BaseModuleTab
    :title="$t(GROUP_MODULE_TITLE.domain, group.structure?.modules?.domains)"
    :count="group.structure?.modules?.domains"
  >
    <BaseStructureDomain :group="group" />
  </BaseModuleTab>
</template>
<style lang="scss" scoped>
.section + .section {
  margin-top: 2rem;
}

.inter-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
