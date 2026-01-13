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
        <CardList :is-loading="isLoading" :items="data" :limit="limitSkeletons">
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

const LIMIT = 6
const limitSkeletons = computed(() =>
  Math.min(props.group.modules?.featured_projects ?? LIMIT, LIMIT)
)

const organizationCode = useOrganizationCode()

const {
  status,
  data,
  isLoading: isLoadingProject,
} = getGroupProject(organizationCode, props.group.id, { paginationConfig: { limit: LIMIT } })
const loading = computed(() => props.isLoading || isLoadingProject.value)
</script>
