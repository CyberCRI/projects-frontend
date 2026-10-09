<script lang="ts" setup>
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import SectionHeader from '~/components/base/SectionHeader.vue'
import ProjectRow from '~/components/project/ProjectRow.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

withDefaults(
  defineProps<{
    status: any
    projects: Array<TranslatedProject>
    isLoading: boolean
    pagination: any
    preview?: boolean
    emptyLabel: string
  }>(),
  {
    preview: false,
  }
)
</script>
<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      id="reviews_projects"
      :pagination="pagination"
      :editable="false"
    >
      <SectionHeader
        :title="$t('me.projects-reviewing', pagination.count.value)"
        :quantity="pagination.count.value"
        :has-button="false"
      />
    </BaseModuleHeader>
    <div class="projects-container">
      <ProjectRow
        v-for="item in projects"
        :key="item.id"
        :horizontal-display="true"
        :project="item"
      />
    </div>
    <EmptyCard
      v-if="!isLoading && projects.length === 0 && !preview"
      class="empty-card"
      :label="emptyLabel"
    />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.projects-container {
  display: flex;
  flex-flow: column nowrap;
  flex-wrap: wrap;
  gap: variables.$space-m;
  padding: variables.$space-m 0;
  align-items: stretch;
  max-width: 100%;
}
</style>
