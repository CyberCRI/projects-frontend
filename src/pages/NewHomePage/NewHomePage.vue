<template>
    <!-- oboarding todos -->
    <OnboardingTodoBlock v-if="showOnbordingTodos" />

    <HomeHeaderConnected v-if="loggedIn" />
    <HomeHeaderAnonymous v-else />

    <div class="page-section-medium">
        <div class="search-input-container">
            <SearchOptions
                class="search-options"
                :show-section-filter="true"
                :search-button="true"
                @search="search"
            ></SearchOptions>
        </div>
    </div>
    <div class="page-section-wide bottom-page">
        <div class="projects-and-people">
            <ProjectCategoriesDropdown />
            <div v-if="loggedIn" class="home-buttons">
                <HomeButtons />
            </div>
            <div class="locations-link">
                <LpiButton
                    :label="$t('home.check-locations')"
                    secondary
                    class="white-bg"
                    @click="$router.push({ name: 'map' })"
                />
            </div>
            <div class="recommandations">
                <RecommendationBlock />
            </div>
        </div>
        <div class="all-news">
            <div class="select-news"></div>
            <div class="news">
                <div v-if="topNews" class="top-news"></div>
                <div class="other-news">
                    <HomeNewsfeed />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import ProjectCategoriesDropdown from '@/components/lpikit/Dropdown/ProjectCategoriesDropdown.vue'
import RecommendationBlock from '@/components/lpikit/Recommendations/RecommendationBlock.vue'
import HomeButtons from '@/components/lpikit/HomeButtons/HomeButtons.vue'
import HomeNewsfeed from '@/components/lpikit/HomeNewsfeed/HomeNewsfeed.vue'
import HomeHeaderConnected from '@/components/lpikit/HomeHeader/HomeHeaderConnected.vue'
import HomeHeaderAnonymous from '@/components/lpikit/HomeHeader/HomeHeaderAnonymous.vue'
import OnboardingTodoBlock from '@/components/lpikit/OnboardingTodoBlock/OnboardingTodoBlock.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'NewHomePage',

    components: {
        OnboardingTodoBlock,
        SearchOptions,
        ProjectCategoriesDropdown,
        RecommendationBlock,
        HomeButtons,
        HomeNewsfeed,
        HomeHeaderConnected,
        HomeHeaderAnonymous,
        LpiButton,
    },

    data() {
        return {
            recommendations: [],
            topNews: null,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        loggedIn() {
            return this.$store.getters['users/isLoggedIn']
        },

        showOnbordingTodos() {
            if (!this.loggedIn) return false
            if (!this.organization?.onboarding_enabled) return false
            const status = this.$store.getters['users/userFromApi']?.onboarding_status || {}
            return (
                status.show_progress &&
                (status.complete_profile ||
                    status.explore_projects ||
                    status.create_project ||
                    status.take_tour)
            )
        },
    },

    methods: {
        search(section, filters) {
            this.$router.push({ name: 'Search', query: { section, ...filters } })
        },
    },
}
</script>

<style lang="scss" scoped>
.search-input-container {
    display: flex;
    padding-top: $space-l;
    padding-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: row;

    @media (min-width: $min-tablet) {
        padding-left: $space-2xl;
        padding-right: $space-2xl;
    }
}

.search-options {
    position: relative;
    cursor: pointer;
}

.search-options {
    padding-top: $space-unit;
}

.bottom-page {
    display: flex;
    margin-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: column;
    gap: $space-2xl;

    @media (min-width: $min-tablet) {
        flex-direction: row;
        align-items: flex-start;
    }
}

.projects-and-people {
    margin-bottom: $space-xl;

    @media (min-width: $min-tablet) {
        flex-basis: 35%;
        margin-bottom: 0;
        flex-shrink: 0;
        position: sticky;
        top: -7rem;
    }

    button {
        background-color: $white;
        cursor: pointer;
    }

    .categories {
        border: 1px solid $gray-10;
        border-radius: $border-radius-s;
        height: pxToRem(50px);
        display: flex;
        justify-content: space-between;
        padding-inline: $space-m;
        align-items: center;
        width: 100%;

        @media (min-width: $min-tablet) {
            margin-top: $space-l;
        }

        .categories-btn {
            color: $primary-dark;
            font-size: $font-size-m;
            font-weight: 700;
        }

        .caret {
            margin-left: $space-l;
            fill: $primary-dark;
            width: pxToRem(20px);
        }
    }

    .home-buttons,
    .locations-link {
        margin-top: $space-l;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: $space-l $space-s;
        border-radius: $border-radius-8;
    }

    .home-buttons {
        background-color: $primary-lighter;
    }

    .locations-link {
        border: $border-width-s solid $primary-dark;
        background-image: url('#{$PUBLIC_BINARIES_PREFIX}/map-images/map-link-background.png');
        background-size: cover;
        background-position: center;
    }

    .recommandations {
        margin-top: $space-l;
        border: 1px solid $green;
        border-radius: $border-radius-s;
    }
}

.all-news {
    height: fit-content;

    @media (min-width: $min-tablet) {
        flex-basis: 65%;
    }

    .select-news {
        height: $space-l;
    }

    .news {
        height: fit-content;

        .top-news {
            height: pxToRem(274px);
            border: 1px solid red;
        }
    }
}
</style>
