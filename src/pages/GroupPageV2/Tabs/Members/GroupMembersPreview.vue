<template>
  <BaseGroupPreview
    id="members"
    :title="$t('group.members')"
    :total="group.modules.members"
    icon="Users"
    :see-more="{ name: 'groupMembers', params: { groupId: group.id } }"
  >
    <template #content>
      <div class="group-members">
        <BaseMembersPreview :group="group" :is-loading="isLoading" class="contents" />
      </div>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'
import BaseMembersPreview from '@/pages/GroupPageV2/Tabs/Members/BaseMembersPreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
</script>

<style lang="scss" scoped>
.group-members {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
