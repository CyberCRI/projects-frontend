<template>
  <BaseGroupPreview
    id="featured_projects"
    :title="$t(GroupModuleTitle.featured_projects, group.modules.featured_projects)"
    :total="group.modules.featured_projects"
    :icon="GroupModuleIcon.featured_projects"
    :see-more="{
      name: 'groupProjects',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <BaseGroupProjectsList :group="group" :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleIcon, GroupModuleTitle } from '~/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import BaseGroupProjectsList from '~/components/group/Modules/Projects/BaseGroupProjectsList.vue'
import BaseGroupPreview from '~/components/group/Modules/BaseGroupPreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>

<style lang="scss" scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
