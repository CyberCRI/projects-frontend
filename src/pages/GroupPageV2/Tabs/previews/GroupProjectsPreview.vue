<template>
  <BaseGroupPreview
    :title="$t('group.projects')"
    :total="group.modules.featured_projects"
    :loading="isLoading"
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
import { getGroupProject } from '@/api/groups.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { translateProjects } = useAutoTranslate()
const organizationCode = useOrganizationCode()
const key = computed(() => `group-${props.group.id}-project-preview`)
const { status, data, isLoading } = useAsyncPaginationAPI(
  key,
  ({ config }) => getGroupProject(organizationCode, props.group.id, config),
  {
    translate: translateProjects,
    paginationConfig: {
      limit: 6,
    },
  }
)
</script>
