<template>
    <div class="recommendation-wrapper">
        <span class="recommendation-title">{{ $t('recommendations.title') }}</span>
        <div v-if="isLoading" class="recommendation-inner">
            <RecommendationListSkeleton />
            <RecommendationListSkeleton v-if="loggedIn" :user-recommendation="true" />
        </div>
        <div v-else class="recommendation-inner">
            <RecommendationList
                :recommendations="projectRecommendations"
                data-test="project-recommendations"
            />
            <RecommendationList
                v-if="loggedIn"
                :recommendations="userRecommendations"
                :user-recommendation="true"
                data-test="user-recommendations"
            />
        </div>
    </div>
</template>

<script>
import RecommendationList from '@/components/lpikit/Recommendations/RecommendationList.vue'
import { getProjectsRecommendations, getUsersRecommendations } from '@/api/recommendations.service'
import RecommendationListSkeleton from '@/components/lpikit/Recommendations/RecommendationListSkeleton.vue'

export default {
    name: 'RecommendationBlock',

    components: { RecommendationList, RecommendationListSkeleton },

    props: {
        organization: {
            type: Object,
            default: () => {},
        },

        loggedIn: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            projectRecommendations: [],
            userRecommendations: [],
            isLoading: true,
        }
    },

    async mounted() {
        let recommendedProjects = await getProjectsRecommendations({
            organization: this.organization.code,
            params: { limit: 4 },
        })
        this.projectRecommendations = recommendedProjects.results

        let recommendedUsers = await getUsersRecommendations({
            organization: this.organization.code,
            params: { limit: 3 },
        })
        this.userRecommendations = recommendedUsers.results

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
