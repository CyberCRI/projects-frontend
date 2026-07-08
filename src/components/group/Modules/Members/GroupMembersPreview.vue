<template>
  <BaseGroupPreview
    id="members"
    :title="$t(GROUP_MODULE_TITLE.members, group.modules.members)"
    :total="group.modules.members"
    :icon="GROUP_MODULE_ICON.members"
    :see-more="{ name: 'groupMembers', params: { groupIdOrSlug: group.slug || group.id } }"
  >
    <template #content>
      <BaseGroupMembersList
        :group="group"
        :is-loading="isLoading"
        :with-pagination="false"
        focus-leader
        preview
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
</script>
