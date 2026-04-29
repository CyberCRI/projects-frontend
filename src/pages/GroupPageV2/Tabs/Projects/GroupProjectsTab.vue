<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.featured_projects)" :count="countElement">
    <BaseGroupProjectsList :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import { GroupModuleTitle } from '~/models/invitation.model'

import BaseGroupProjectsList from '~/components/group/Modules/Projects/BaseGroupProjectsList.vue'

import BaseGroupTab from '~/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.featured_projects)
</script>
