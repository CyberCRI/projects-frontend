<template>
  <BaseGroupPreview
    id="event"
    :title="$t(GROUP_MODULE_TITLE.event, group.modules.event)"
    :total="group.modules.event"
    :icon="GROUP_MODULE_ICON.event"
    :see-more="{
      name: 'groupEvent',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <BaseGroupEventList :group="group" :with-pagination="false" :limit="3" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models/people-group.model'
import BaseGroupEventList from '@/components/group/Modules/Event/BaseGroupEventList.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
