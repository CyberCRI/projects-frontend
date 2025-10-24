<template>
  <div
    v-if="isLoading || projectRecommendations?.length || userRecommendations?.length"
    class="recommandations"
  >
    <div class="recommendation-wrapper">
      <span class="recommendation-title">{{ $t('recommendations.title') }}</span>
      <div v-if="isLoading" class="recommendation-inner">
        <RecommendationListSkeleton />
        <RecommendationListSkeleton v-if="loggedIn" :user-recommendation="true" />
      </div>
      <div
        v-else-if="projectRecommendations?.length || userRecommendations?.length"
        class="recommendation-inner"
      >
        <ProjectRecommendationList
          v-if="projectRecommendations?.length"
          :recommendations="projectRecommendations"
          data-test="project-recommendations"
        />
        <UserRecommendationList
          v-if="loggedIn && userRecommendations?.length"
          :recommendations="userRecommendations"
          data-test="user-recommendations"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UserRecommendationList from '@/components/search/Recommendations/UserRecommendationList.vue'
import ProjectRecommendationList from '@/components/search/Recommendations/ProjectRecommendationList.vue'
import {
  getRandomProjectsRecommendationsForUser,
  getRandomUsersRecommendationsForUser,
} from '@/api/recommendations.service'
import { getFeaturedProjects } from '@/api/organizations.service'
import RecommendationListSkeleton from '@/components/search/Recommendations/RecommendationListSkeleton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
export default {
  name: 'RecommendationBlock',

  components: { UserRecommendationList, ProjectRecommendationList, RecommendationListSkeleton },
  setup() {
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const { translateProjects, translateUsers } = useAutoTranslate()
    const _projectRecommendations = ref([])
    const _userRecommendations = ref([])
    const projectRecommendations = translateProjects(_projectRecommendations)
    const userRecommendations = translateUsers(_userRecommendations)
    const isLoading = ref(true)
    return {
      organizationsStore,
      usersStore,
      _projectRecommendations,
      _userRecommendations,
      projectRecommendations,
      userRecommendations,
      isLoading,
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },

    loggedIn() {
      return this.usersStore.isConnected
    },
  },

  async mounted() {
    let featuredrojects = []
    try {
      featuredrojects = (await getFeaturedProjects(this.organization.code)).results || []
    } catch (err) {
      console.log(err)
      featuredrojects = []
    }

    const projectRecommendations = await getRandomProjectsRecommendationsForUser({
      organization: this.organization.code,
      params: { count: 4, pool: 25 },
    })

    this._projectRecommendations = [
      ...featuredrojects.map((p) => ({ ...p, isFeatured: true })),
      ...projectRecommendations.map((p) => ({ ...p, isFeatured: false })),
    ].slice(0, 4)

    if (this.loggedIn) {
      this._userRecommendations = await getRandomUsersRecommendationsForUser({
        organization: this.organization.code,
        params: { count: 3, pool: 25 },
      })
    }
    this.isLoading = false
  },
}
</script>

<style lang="scss" scoped>
.recommandations {
  margin-top: $space-l;
  border: 1px solid $primary;
  border-radius: $border-radius-s;
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
