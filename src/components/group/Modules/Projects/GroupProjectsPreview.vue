<template>
  <BaseGroupPreview
    id="featured_projects"
    :title="$t('group.projects')"
    :total="group.modules.featured_projects"
    icon="Briefcase"
    :see-more="{
      name: 'groupProjects',
      params: { groupId: group.id },
    }"
  >
    <template #content>
      <BaseGroupProjectsList :group="group" :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import BaseGroupProjectsList from '@/components/group/Modules/Projects/BaseGroupProjectsList.vue'

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
