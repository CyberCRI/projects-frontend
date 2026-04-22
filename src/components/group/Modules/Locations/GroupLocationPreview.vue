<template>
  <BaseGroupPreview
    id="locations"
    :title="$t(GroupModuleTitle.locations, group.modules.locations)"
    :total="group.modules.locations"
    :icon="GroupModuleIcon.locations"
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
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
