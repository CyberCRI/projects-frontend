<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.news)" :count="countElement">
    <BaseGroupNewsList :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed<number>(() => props.group.modules?.news)
</script>
