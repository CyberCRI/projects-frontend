<template>
  <BaseGroupPreview
    :title="$t('group.projects')"
    :total="group.modules.projects"
    :loading="loading"
    :see-more="{
      name: 'groupProjects',
      params: { groupId: $route.params.groupId },
    }"
  >
    <template #content>
      <FetchLoader :status="status">
        <CardList :items="translatedProjects">
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
import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const LIMIT_MEMBERS = 12
const { translateProjects } = useAutoTranslate()
const organizationCode = useOrganizationCode()
const { status, data } = getGroupProject(organizationCode, props.group.id, {
  query: { limit: LIMIT_MEMBERS },
})
const results = computed(() => data.value?.results)
const translatedProjects = translateProjects(results)

const loading = useLoadingFromStatus(status)
</script>
