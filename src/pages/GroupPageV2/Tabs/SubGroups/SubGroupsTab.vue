<template>
  <BaseModuleTab
    id="subgroups"
    :title="$t(GROUP_MODULE_TITLE.subgroups, group.modules.subgroups)"
    :count="group.modules.subgroups"
    :icon="GROUP_MODULE_ICON.subgroups"
  >
    <GroupSubList :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
