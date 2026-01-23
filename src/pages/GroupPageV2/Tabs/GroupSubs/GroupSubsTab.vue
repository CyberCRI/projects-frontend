<template>
  <BaseGroupTab :header="false">
    <GroupSubList :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
