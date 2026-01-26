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
        <BaseGroupMembersList
          :group="group"
          :is-loading="isLoading"
          class="contents"
          :with-pagination="false"
        />
      </div>
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

<style lang="scss" scoped>
.group-members {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
