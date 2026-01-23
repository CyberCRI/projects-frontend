<template>
  <BaseGroupPreview
    id="subgroup"
    :title="t(GroupModuleTitle.subgroups)"
    :total="group.modules.subgroups"
    :icon="GroupModuleIcon.subgroups"
    :see-more="{
      name: 'groupSubs',
      params: { groupId: group.id },
    }"
  >
    <template #content>
      <GroupSubList :group="group" :limit="2" :with-pagination="false" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()

const { t } = useNuxtI18n()
</script>
