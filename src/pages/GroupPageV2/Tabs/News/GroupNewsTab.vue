<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.news)" :count="countElement">
    <BaseGroupNewsList :group="group" :editable="isInEditingMode" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'

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
