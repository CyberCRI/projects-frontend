<template>
  <BaseGroupPreview
    :title="$t('group.projects')"
    :total="group.modules.featured_projects"
    :loading="loading"
    :see-more="{
      name: 'groupProjects',
      params: { groupId: $route.params.groupId },
    }"
  >
    <template #content>
      <FetchLoader :status="status">
        <CardList :items="data">
          <template #default="projectListSlotProps">
            <ProjectCard :horizontal-display="true" :project="projectListSlotProps.item" />
          </template>
        </CardList>
      </FetchLoader>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getGroupProject } from '@/api/v2/group.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

const organizationCode = useOrganizationCode()

const {
  status,
  data,
  isLoading: isLoadingProject,
} = getGroupProject(organizationCode, props.group.id, { paginationConfig: { limit: 6 } })
const loading = computed(() => props.isLoading || isLoadingProject.value)
</script>
