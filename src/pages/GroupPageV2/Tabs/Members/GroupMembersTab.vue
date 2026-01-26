<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.members)" :count="countElement">
    <div class="container">
      <BaseGroupMembersList :group="group" />
    </div>
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

defineOptions({ name: 'GroupMembersTab' })

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
