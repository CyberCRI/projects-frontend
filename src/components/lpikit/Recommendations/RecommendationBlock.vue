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
        this.projectRecommendations = await this.$store.dispatch(
            'recommendations/getProjectsRecommendations',
            {
                organization: this.organization.code,
                params: { limit: 4 },
            }
        )

        this.userRecommendations = await this.$store.dispatch(
            'recommendations/getUsersRecommendations',
            {
                organization: this.organization.code,
                params: { limit: 3 },
            }
        )

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
