<template>
    <div class="recommendation-wrapper">
        <span class="recommendation-title">{{ $t('recommendations.title') }}</span>
        <LpiLoader v-if="isLoading" class="loading" type="simple" />
        <div v-else>
            <RecommendationList :recommendations="projectRecommendations" />
            <RecommendationList
                v-if="loggedIn"
                :recommendations="userRecommendations"
                :user-recommendation="true"
            />
        </div>
    </div>
</template>

<script>
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import RecommendationList from '@/components/lpikit/Recommendations/RecommendationList.vue'
import { getProjectsRecommendations, getUsersRecommendations } from '@/api/recommendations.service'

export default {
    name: 'RecommendationBlock',

    components: { RecommendationList, LpiLoader },

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

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: $space-xl;
    margin-bottom: $space-m;
}
</style>
