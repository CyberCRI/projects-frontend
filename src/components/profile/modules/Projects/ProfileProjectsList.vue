<script lang="ts" setup>
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import ProjectPreview from '~/components/project/ProjectPreview.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

withDefaults(
  defineProps<{
    status: any
    projects: TranslatedProject[]
    isLoading: boolean
    pagination: Pagination
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

    <ul class="project-list list-divider">
      <li v-for="project in projects" :key="project.id">
        <ProjectPreview :project="project" />
      </li>
    </ul>
    <EmptyCard
      v-if="!isLoading && projects.length === 0 && !preview"
      class="empty-card"
      :label="emptyLabel"
    />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
