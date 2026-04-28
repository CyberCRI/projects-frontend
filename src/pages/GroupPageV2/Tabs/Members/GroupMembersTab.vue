<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.members)" :count="countElement">
    <BaseGroupMembersList :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupMembersList from '~/components/group/Modules/Members/BaseGroupMembersList.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '~/models/invitation.model'
import BaseGroupTab from '~/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.members)
</script>
