<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'
import { BaseStructureDomain } from '#components'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; editable?: boolean }>(),
  {
    editable: false,
  }
)
// TODO: just preventing lint error for now
console.log('TODO editable', props.editable)
</script>

<template>
  <BaseModuleTab
    :title="$t(GROUP_MODULE_TITLE.researchAreasSkills, group.structure?.modules?.domains)"
    :count="group.structure?.modules?.domains"
  >
    <div v-if="group.structure?.modules.domains" class="section">
      <h3 class="inter-title">{{ $t(GROUP_MODULE_TITLE.researchAreas) }}</h3>
      <BaseStructureDomain :group="group" />
    </div>
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
