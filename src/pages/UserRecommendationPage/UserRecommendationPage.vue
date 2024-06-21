<template>
    <div class="page-section-wide page-top recommendation-page">
        <h1 class="page-title">{{ $t('recommendations.connect-to') }}</h1>

        <CardList
            :desktop-columns-number="6"
            :is-loading="isLoading"
            :limit="limit"
            :peoples="usersRecommendationsRequest?.results"
            class="list-container"
        >
            <template #peoples="peoplesListSlotProps">
                <UserCard
                    :user="peoplesListSlotProps.user"
                    :to-link="{
                        name: 'ProfileOtherUser',
                        params: {
                            userId: peoplesListSlotProps.user.slug || peoplesListSlotProps.user.id,
                        },
                    }"
                />
            </template>
        </CardList>

        <div v-if="pagination.total > 1 && !isLoading" class="pagination-wrapper">
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>
</template>
<script>
import UserCard from '@/components/people/UserCard.vue'
import CardList from '@/components/base/CardList.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { getUsersRecommendationsForUser } from '@/api/recommendations.service'
import { axios } from '@/api/api.config'
export default {
    name: 'UserRecommendationPage',

    components: {
        UserCard,
        CardList,
        PaginationButtons,
    },

    data() {
        return {
            usersRecommendationsRequest: null,
            limit: 10,
            isLoading: false,
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
        }
    },
    watch: {
        usersRecommendationsRequest: {
            handler(response) {
                this.updatePagination(response)
            },
            deep: true,
        },
    },
    async mounted() {
        this.isLoading = true
        this.usersRecommendationsRequest = await getUsersRecommendationsForUser(
            this.$store.getters['organizations/current'].code,
            { limit: this.limit }
        )
        this.isLoading = false
    },

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.usersRecommendationsRequest = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.page-title')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updatePagination(response) {
            this.pagination.currentPage = response.current_page
            this.pagination.total = response.total_page
            this.pagination.previous = response.previous
            this.pagination.next = response.next
            this.pagination.first = response.first
            this.pagination.last = response.last
        },
    },
}
</script>
<style lang="scss" scoped>
.pagination-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
}

.recommendation-page {
    margin-bottom: 4rem;
}
</style>
