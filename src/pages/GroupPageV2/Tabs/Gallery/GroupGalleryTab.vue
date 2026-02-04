<template>
  <BaseGroupTab :title="$t(GroupModuleTitle.gallery)" :count="countElement">
    <div class="">
      <BaseGroupGallery :group="group" :editable="isInEditingMode" />
    </div>
  </BaseGroupTab>
</template>

<script setup lang="ts">
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupTab from '@/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isInEditingMode?: boolean
  }>(),
  { isInEditingMode: false }
)

const countElement = computed<number>(() => props.group.modules?.gallery)
</script>
