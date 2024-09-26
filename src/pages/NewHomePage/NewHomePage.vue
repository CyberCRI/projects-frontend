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
            <HomeButtons v-if="loggedIn" />
            <LocationsLink />
            <RecommendationBlock />
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
import LocationsLink from '@/components/home/LocationsLink/LocationsLink.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
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
        LocationsLink,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        const usersStore = useUsersStore()
        return {
            organizationsStore,
            usersStore,
        }
    },
    computed: {
        organization() {
            return this.organizationsStore.current
        },

        loggedIn() {
            return this.usersStore.isLoggedIn
        },

        showOnbordingTodos() {
            if (!this.loggedIn) return false
            if (!this.organization?.onboarding_enabled) return false
            const status = this.usersStore.userFromApi?.onboarding_status || {}
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
