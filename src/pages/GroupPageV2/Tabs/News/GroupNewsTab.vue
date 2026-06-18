<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.news)" :count="countElement">
    <BaseGroupNewsList :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const countElement = computed<number>(() => props.group.modules?.news || 0)
</script>
