<template>
    <div class="recommendation-wrapper">
        <span class="recommendation-title">{{ $t('recommendations.title') }}</span>
        <div v-if="isLoading" class="recommendation-inner">
            <RecommendationListSkeleton />
            <RecommendationListSkeleton v-if="loggedIn" :user-recommendation="true" />
        </div>
        <div v-else class="recommendation-inner">
            <ProjectRecommendationList
                :recommendations="projectRecommendations"
                data-test="project-recommendations"
            />
            <UserRecommendationList
                v-if="loggedIn"
                :recommendations="userRecommendations"
                data-test="user-recommendations"
            />
        </div>
    </div>
</template>

<script>
import UserRecommendationList from '@/components/lpikit/Recommendations/UserRecommendationList.vue'
import ProjectRecommendationList from '@/components/lpikit/Recommendations/ProjectRecommendationList.vue'
import {
    getRandomProjectsRecommendationsForUser,
    getRandomUsersRecommendationsForUser,
} from '@/api/recommendations.service'
import RecommendationListSkeleton from '@/components/lpikit/Recommendations/RecommendationListSkeleton.vue'

export default {
    name: 'RecommendationBlock',

    components: { UserRecommendationList, ProjectRecommendationList, RecommendationListSkeleton },

    data() {
        return {
            projectRecommendations: [],
            userRecommendations: [],
            isLoading: true,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        loggedIn() {
            return this.$store.getters['users/isLoggedIn']
        },
    },

    async mounted() {
        this.projectRecommendations = await getRandomProjectsRecommendationsForUser({
            organization: this.organization.code,
            params: { count: 4, pool: 25 },
        })

        if (this.loggedIn) {
            this.userRecommendations = await getRandomUsersRecommendationsForUser({
                organization: this.organization.code,
                params: { count: 3, pool: 25 },
            })
        }
        this.isLoading = false
    },
}
</script>

<style lang="scss" scoped>
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
