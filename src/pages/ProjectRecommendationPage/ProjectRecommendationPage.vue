<script setup lang="ts">
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import { getProjectsRecommendationsForUser } from '~/api/v2/recommendations.service'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import NothingHere from '~/components/base/NothingHere.vue'

const { t } = useNuxtI18n()

const organizationCode = useOrganizationCode()

const { status, data, pagination } = getProjectsRecommendationsForUser(organizationCode, {
  default: () => factoryPagination(projectSkeleton, 10),
})

useLpiHead2({
  title: computed(() => t('recommendations.projects.title')),
})
</script>

<template>
  <div class="page-section-wide page-top recommendation-page">
    <h1 class="page-title">
      {{ $t('recommendations.projects.title') }}
    </h1>

    <FetchLoader :status="status" only-error skeleton>
      <div class="list-users">
        <ProjectCard
          v-for="project in data"
          :key="project.id"
          :project="project"
          :to-link="{
            name: 'ProfileOtherUser',
            params: {
              userId: project.slug || project.id,
            },
          }"
        />
        <NothingHere v-if="data.length === 0" class="m-auto" />
      </div>

      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
.list-users {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
