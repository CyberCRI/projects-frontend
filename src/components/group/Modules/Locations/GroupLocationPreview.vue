<template>
  <BaseGroupPreview
    id="projects_locations"
    :title="$t(GroupModuleTitle.projects_locations, group.modules.projects_locations)"
    :total="group.modules.projects_locations"
    :icon="GroupModuleIcon.projects_locations"
  >
    <template #header>
      <SeeMoreArrow
        class="see-more-btn reset-btn"
        :to="{
          name: 'groupLocations',
          params: { groupId: group.id },
        }"
      />
    </template>
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
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import GroupLocationBase from '@/components/group/Modules/Locations/GroupLocationBase.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
