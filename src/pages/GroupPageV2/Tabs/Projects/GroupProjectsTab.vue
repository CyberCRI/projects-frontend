<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.featured_projects)" :count="countElement">
    <BaseGroupProjectsList :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'

import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.featured_projects)
</script>
