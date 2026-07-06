<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE.gallery, countElement)" :count="countElement">
    <BaseGroupGallery :group="group" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    editable?: boolean
  }>(),
  { editable: false }
)

const countElement = computed<number>(() => props.group.modules?.gallery)
</script>
