<template>
  <BaseModuleTab :title="$t(GroupModuleTitle.gallery, countElement)" :count="countElement">
    <BaseGroupGallery :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GroupModuleTitle } from '@/models/invitation.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.group.modules?.gallery)
</script>
