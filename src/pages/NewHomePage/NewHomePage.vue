<template>
    <!-- oboarding todos -->
    <OnboardingTodoBlock v-if="showOnbordingTodos" />

    <HomeHeaderConnected v-if="loggedIn" />
    <HomeHeaderAnonymous v-else />

    <div class="page-section-medium">
        <div class="search-input-container">
            <SearchOptions
                class="search-options"
                show-section-drop-down
                search-button
                @search-options-updated="search"
                @enter="search"
            ></SearchOptions>
        </div>
    </div>
    <div class="page-section-wide bottom-page">
        <div class="projects-and-people">
            <ProjectCategoriesDropdown :dropdown-label="$t('project.categories')">
                <template #default="{ category }">
                    <ProjectCategoriesDropdownElementLink :category="category" />
                </template>
            </ProjectCategoriesDropdown>
            <div v-if="loggedIn" class="home-buttons">
                <HomeButtons />
            </div>
            <div class="locations-link" :class="{ 'is-hovered': locationButtonHover }">
                <LpiButton
                    :label="$t('home.check-locations')"
                    secondary
                    class="white-bg"
                    @click="$router.push({ name: 'map' })"
                    @mouseover="locationButtonHover = true"
                    @mouseout="locationButtonHover = false"
                />
            </div>
            <div class="recommandations">
                <RecommendationBlock />
            </div>
        </div>
        <div class="all-news">
            <div class="select-news"></div>
            <div class="news">
                <div class="other-news">
                    <HomeNewsfeed />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/search/SearchOptions/SearchOptions.vue'
import ProjectCategoriesDropdown from '@/components/category/ProjectCategoriesDropdown.vue'
import ProjectCategoriesDropdownElementLink from '@/components/category/ProjectCategoriesDropdownElementLink.vue'
import RecommendationBlock from '@/components/search/Recommendations/RecommendationBlock.vue'
import HomeButtons from '@/components/home/HomeButtons/HomeButtons.vue'
import HomeNewsfeed from '@/components/home/HomeNewsfeed/HomeNewsfeed.vue'
import HomeHeaderConnected from '@/components/home/HomeHeader/HomeHeaderConnected.vue'
import HomeHeaderAnonymous from '@/components/home/HomeHeader/HomeHeaderAnonymous.vue'
import OnboardingTodoBlock from '@/components/onboarding/OnboardingTodoBlock/OnboardingTodoBlock.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'NewHomePage',

    components: {
        OnboardingTodoBlock,
        SearchOptions,
        ProjectCategoriesDropdown,
        ProjectCategoriesDropdownElementLink,
        RecommendationBlock,
        HomeButtons,
        HomeNewsfeed,
        HomeHeaderConnected,
        HomeHeaderAnonymous,
        LpiButton,
    },

    data() {
        return {
            locationButtonHover: false,
            recommendations: [],
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
        search(options) {
            this.$router.push({ name: 'Search', query: options })
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
    position: relative; // higher than home category dropdown and buttons and suggestions
    z-index: 10;

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
        z-index: 1;
        top: -7rem;
    }

    button {
        background-color: $white;
        cursor: pointer;
    }

    .categories {
        border: 1px solid $lighter-gray;
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
        background-size: 100%;
        background-position: center;
        transition: all 0.3s ease-in-out;

        @media screen and (max-width: $max-mobile) {
            background-size: cover;
        }

        &.is-hovered {
            background-size: 120%;
        }
    }

    .recommandations {
        margin-top: $space-l;
        border: 1px solid $primary;
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
    }
}
</style>
