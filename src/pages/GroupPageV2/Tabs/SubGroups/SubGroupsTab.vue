<template>
  <BaseModuleTab
    id="subgroups"
    :title="$t(GroupModuleTitle.subgroups, group.modules.subgroups)"
    :count="group.modules.subgroups"
    :icon="GroupModuleIcon.subgroups"
  >
    <GroupSubList :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'
import { GroupModuleIcon, GroupModuleTitle } from '@/models/people-group.model'
import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
