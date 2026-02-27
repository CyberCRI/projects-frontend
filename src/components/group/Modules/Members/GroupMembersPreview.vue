<template>
  <BaseGroupPreview
    id="members"
    :title="$t('group.members')"
    :total="group.modules.members"
    icon="Users"
    :see-more="{ name: 'groupMembers', params: { groupId: group.id } }"
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
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
</script>
