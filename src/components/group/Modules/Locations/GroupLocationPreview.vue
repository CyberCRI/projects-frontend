<template>
  <BaseGroupPreview
    id="locations"
    :title="$t(GroupModuleTitle.locations, group.modules.locations)"
    :total="group.modules.locations"
    :icon="GroupModuleIcon.locations"
  >
    <template #header>
      <SeeMoreArrow
        class="see-more-btn reset-btn"
        :to="{
          name: 'groupLocations',
          params: { groupIdOrSlug: group.slug || group.id },
        }"
      />
    </template>
    <template #content>
      <GroupLocationBase :group="group" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleIcon, GroupModuleTitle } from '~/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import GroupLocationBase from '~/components/group/Modules/Locations/GroupLocationBase.vue'
import BaseGroupPreview from '~/components/group/Modules/BaseGroupPreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
