<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { getUserProjectsReviewer } from '~/api/v2/user.service'
import ProjectCard from '~/components/project/ProjectCard.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
  }>(),
  {
    limit: null,
    preview: false,
  }
)

const profileId = computed(() => props.profile.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.profile.modules.reviews_projects, props.limit)
)

const {
  status,
  data: projects,
  pagination,
  isLoading,
} = getUserProjectsReviewer(organizationCode, profileId, {
  paginationConfig: {
    limit: props.limit,
  },
  immediate: profileId.value != -1,
  keyFixed: computed(() => props.preview),
  default: () => factoryPagination(projectSkeleton, limitSkeletons.value),
})
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
      <ProjectCard
        v-for="item in projects"
        :key="item.id"
        :horizontal-display="true"
        :project="item"
      />
    </div>
    <EmptyCard
      v-if="!isLoading && projects.length === 0 && !preview"
      class="empty-card"
      :label="$t('me.no-project-reviewing')"
    />

    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.projects-container {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-m;
  padding: variables.$space-m 0;
}
</style>
