<template>
  <BaseGroupPreview
    id="locations"
    :title="$t(GROUP_MODULE_TITLE.locations, group.modules.locations)"
    :total="group.modules.locations"
    :icon="GROUP_MODULE_ICON.locations"
    :see-more="{
      name: 'groupLocations',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <GroupLocationBase :group="group" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models/people-group.model'
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
