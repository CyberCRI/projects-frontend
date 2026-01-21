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
      <FetchLoader :status="status" :with-data="!!data && !!data?.[0]">
        <ul class="project-list list-divider">
          <li v-for="project in data" :key="project.id">
            <ProjectPreview :project="project" />
          </li>
        </ul>
      </FetchLoader>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getGroupProject } from '@/api/v2/group.service'
import ProjectPreview from '@/components/project/ProjectPreview.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const LIMIT = 6
const organizationCode = useOrganizationCode()

const { status, data } = getGroupProject(organizationCode, props.group.id, {
  paginationConfig: { limit: LIMIT },
})
</script>

<style lang="scss" scoped>
.project-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
