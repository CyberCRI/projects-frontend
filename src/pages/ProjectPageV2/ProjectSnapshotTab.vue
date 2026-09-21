<template>
  <div class="project-summary">
    <ProjectHeaderV2 :project="project" class="project-header v2" />

    <ProjectDescriptionPreview v-if="!descripitonEmpty" :project="project" />

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

    <ProjectPrivateExchangePreview
      v-if="project.modules.messages && isMemberOrAdmin"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectPrivateExchangePreview from '@/components/project/modules/PrivateExchange/ProjectPrivateExchangePreview.vue'
import ProjectTabItemPreview from '~/components/project/modules/Additionals/ProjectTabItemPreview.vue'
import ProjectDescriptionPreview from '@/components/project/modules/ProjectDescriptionPreview.vue'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { textIsEmpty } from '@/functs/tiptap'
import { sanitizeTabs } from '~/functs/tabs'

const props = defineProps<{
  project: TranslatedProject
}>()

const { isAdmin } = usePermissions()
const { isMember } = usePermissionProject(computed(() => props.project.id))

const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)

const descripitonEmpty = computed(() => textIsEmpty(props.project.$t.description))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  error,
  data: tabs,
} = getAllProjectTab(organizationCode, projectId, {
  query: {
    show_preview: true,
    show_tab: true,
  },
  default: () => factoryPagination(projectTabSkeleton, 0),
  paginationConfig: {
    limit: 999,
  },
  uniqueKey: 'preview',
})

const allTabs = computed(() => sanitizeTabs(tabs.value, props.project.modules))
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.project-summary {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
