<template>
  <BaseGroupPreview
    id="featured_projects"
    :title="$t(GROUP_MODULE_TITLE.featured_projects, group.modules.featured_projects)"
    :total="group.modules.featured_projects"
    :icon="GROUP_MODULE_ICON.featured_projects"
    :see-more="{
      name: 'groupProjects',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <BaseGroupProjectsList :group="group" :limit="6" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models/people-group.model'
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

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
