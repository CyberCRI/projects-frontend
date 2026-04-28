<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.featured_projects)" :count="countElement">
    <BaseGroupProjectsList :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { GroupModuleTitle } from '@/models/invitation.model'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.featured_projects)
</script>
