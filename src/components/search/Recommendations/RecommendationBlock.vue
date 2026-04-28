<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="recommandations">
      <div class="recommendation-wrapper">
        <span class="recommendation-title">{{ $t('recommendations.title') }}</span>
        <div class="recommendation-inner">
          <ProjectRecommendationList
            v-if="allProjects.length"
            :projects="allProjects"
            data-test="project-recommendations"
          />
          <UserRecommendationList
            v-if="loggedIn && recomendedUsers.length"
            :users="recomendedUsers"
            data-test="user-recommendations"
          />
        </div>
      </div>
    </div>
  </FetchLoader>
</template>

<script setup lang="ts">
import UserRecommendationList from '@/components/search/Recommendations/UserRecommendationList.vue'
import ProjectRecommendationList from '@/components/search/Recommendations/ProjectRecommendationList.vue'
import useUsersStore from '@/stores/useUsers'
import { getFeaturedProjects } from '@/api/v2/organizations.service'
import {
  getRandomProjectsRecommendationsForUser,
  getRandomUsersRecommendationsForUser,
} from '@/api/v2/recommendations.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { factoriesSkeleton, factoryPagination } from '@/skeletons/base.skeletons'
import { projectSkeleton } from '@/skeletons/project.skeletons'
import { userSkeleton } from '@/skeletons/user.skeletons'

const usersStore = useUsersStore()
const loggedIn = computed(() => usersStore.isConnected)

const organizationCode = useOrganizationCode()

const LIMIT_PROJECT = 4

const { status: statusFeaturedProjects, data: featuredProjects } = getFeaturedProjects(
  organizationCode,
  {
    default: () => factoryPagination(projectSkeleton, LIMIT_PROJECT),
  }
)

const { status: statusRecomendationsProjects, data: recomendedProject } =
  getRandomProjectsRecommendationsForUser(organizationCode, {
    query: {
      count: LIMIT_PROJECT,
      pool: 25,
    },
    default: () => factoriesSkeleton(projectSkeleton, LIMIT_PROJECT),
  })

const allProjects = computed(() => {
  console.log(featuredProjects.value, recomendedProject.value)
  return [
    ...featuredProjects.value.map((project) => ({ ...project, isFeatured: true })),
    ...recomendedProject.value.map((project) => ({ ...project, isFeatured: false })),
  ]
})

const LIMIT_USER = 3

const {
  status: statusRecomendationsUsers,
  data: recomendedUsers,
  refresh: refreshRecomendedUsers,
} = getRandomUsersRecommendationsForUser(organizationCode, {
  query: {
    count: LIMIT_USER,
    pool: 25,
  },
  default: () => factoriesSkeleton(userSkeleton, LIMIT_USER),
  // only fetch recomended users when is logged
  immediate: loggedIn.value,
})

watchEffect(() => {
  if (loggedIn.value) {
    refreshRecomendedUsers()
  }
})

const status = computed(() => {
  const st = [statusFeaturedProjects.value, statusRecomendationsProjects.value]
  if (loggedIn.value) {
    st.push(statusRecomendationsUsers.value)
  }
  return st
})
</script>

<style lang="scss" scoped>
.recommandations {
  margin-top: $space-l;
  border: 1px solid $primary;
  border-radius: $border-radius-s;
  overflow-x: hidden;
}

.recommendation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block: $space-l;
}

.recommendation-title {
  font-size: $font-size-l;
  font-weight: 700;
}

.recommendation-inner {
  width: 100%;
}
</style>
