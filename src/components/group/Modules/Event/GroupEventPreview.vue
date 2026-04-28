<template>
  <BaseGroupPreview
    id="event"
    :title="$t(GroupModuleTitle.event, group.modules.event)"
    :total="group.modules.event"
    :icon="GroupModuleIcon.event"
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
import { GroupModuleIcon, GroupModuleTitle } from '~/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import BaseGroupEventList from '~/components/group/Modules/Event/BaseGroupEventList.vue'
import BaseGroupPreview from '~/components/group/Modules/BaseGroupPreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
