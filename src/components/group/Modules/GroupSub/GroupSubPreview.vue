<template>
  <BaseGroupPreview
    id="subgroups"
    :title="$t(GroupModuleTitle.subgroups, group.modules.subgroups)"
    :total="group.modules.subgroups"
    :icon="GroupModuleIcon.subgroups"
    :see-more="{
      name: 'subGroups',
      params: {
        groupIdOrSlug: group.slug || group.id,
      },
    }"
  >
    <template #content>
      <GroupSubList :group="group" :limit="2" :limit-members="6" :with-pagination="false" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleIcon, GroupModuleTitle } from '~/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import GroupSubList from '~/components/group/Modules/GroupSub/GroupSubList.vue'
import BaseGroupPreview from '~/components/group/Modules/BaseGroupPreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
