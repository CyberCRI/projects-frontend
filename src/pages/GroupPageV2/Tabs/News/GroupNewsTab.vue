<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.news)" :count="countElement">
    <BaseGroupNewsList :group="group" :editable="isInEditingMode" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import { GroupModuleTitle } from '~/models/invitation.model'

import BaseGroupNewsList from '~/components/group/Modules/News/BaseGroupNewsList.vue'

import BaseGroupTab from '~/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isInEditingMode?: boolean
  }>(),
  {
    isInEditingMode: false,
  }
)

const countElement = computed<number>(() => props.group.modules?.news || 0)
</script>
