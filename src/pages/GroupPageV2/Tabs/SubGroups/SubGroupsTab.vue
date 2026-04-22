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
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
