<template>
  <BaseGroupPreview
    :title="$t('group.projects')"
    :total="group.modules.featured_projects"
    icon="Briefcase"
    :see-more="{
      name: 'groupProjects',
      params: { groupId: group.id },
    }"
  >
    <template #content>
      <FetchLoader :status="status" only-error>
        <CardList :is-loading="loading" :items="data" :limit="limitSkeletons">
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
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'

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
