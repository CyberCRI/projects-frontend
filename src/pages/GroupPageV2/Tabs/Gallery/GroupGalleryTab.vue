<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.gallery, countElement)" :count="countElement">
    <BaseGroupGallery :group="group" :editable="isInEditingMode" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isInEditingMode?: boolean
  }>(),
  { isInEditingMode: false }
)

const countElement = computed<number>(() => props.group.modules?.gallery)
</script>
