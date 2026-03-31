<template>
  <BaseGroupPreview
    id="members"
    :title="$t(GroupModuleTitle.members, group.modules.members)"
    :total="group.modules.members"
    :icon="GroupModuleIcon.members"
    :see-more="{ name: 'groupMembers', params: { groupIdOrSlug: group.slug || group.id } }"
  >
    <template #content>
      <BaseGroupMembersList
        :group="group"
        :is-loading="isLoading"
        :with-pagination="false"
        focus-leader
      />
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
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
</script>
