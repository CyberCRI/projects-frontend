<template>
  <BaseGroupPreview
    id="subgroups"
    :title="$t(GROUP_MODULE_TITLE.subgroups, group.modules.subgroups)"
    :total="group.modules.subgroups"
    :icon="GROUP_MODULE_ICON.subgroups"
    :see-more="{
      name: 'subGroups',
      params: {
        groupIdOrSlug: group.slug || group.id,
      },
    }"
  >
    <template #content>
      <GroupSubList :group="group" :limit="2" :limit-members="6" :with-pagination="false" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models/people-group.model'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
