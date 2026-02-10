<template>
  <BaseGroupPreview
    id="locations"
    :title="$t(GroupModuleTitle.locations)"
    :total="group.modules.locations"
    :icon="GroupModuleIcon.locations"
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
