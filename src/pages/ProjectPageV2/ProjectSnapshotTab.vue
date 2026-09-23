<template>
  <div class="project-summary">
    <ProjectHeaderV2 :project="project" class="project-header v2" />
    <FetchLoader :status="status" :error="error" only-error skeleton>
      <template v-for="tab in allTabs">
        <ProjectTabItemPreview
          v-if="tab.modules.items"
          :key="tab.id"
          :tab="tab"
          :project="project"
        />
      </template>
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import ProjectTabItemPreview from '~/components/project/modules/Additionals/ProjectTabItemPreview.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { sanitizeTabs } from '~/functs/tabs'

const props = defineProps<{
  project: TranslatedProject
}>()

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  error,
  data: tabs,
} = getAllProjectTab(organizationCode, projectId, {
  default: () => factoryPagination(projectTabSkeleton, 0),
  paginationConfig: {
    limit: 999,
  },
  uniqueKey: 'preview',
})

const allTabs = computed(() =>
  sanitizeTabs(tabs.value, props.project.modules).filter((tab) => tab.show_preview && tab.show_tab)
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.project-summary {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
