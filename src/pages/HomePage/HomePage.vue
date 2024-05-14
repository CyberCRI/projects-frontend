<template>
    <div class="home-page">
        <PotatoIcon0 class="potato potato--potato0" />
        <PotatoIcon1 class="potato potato--potato1" />
        <div class="potato-ctn">
            <PotatoIcon2 class="potato potato--potato2" />
        </div>
        <PotatoIcon3 class="potato potato--potato3" />
        <PotatoIcon4 class="potato potato--potato4" />

        <!-- oboarding todos -->
        <OnboardingTodoBlock v-if="showOnbordingTodos" />

        <!-- Logo and text -->
        <div class="page-section-medium logo-container">
            <img
                v-if="organization && organization.logo_image"
                :src="organization.logo_image.url"
                alt=""
                class="organization-logo"
            />
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>

        <div class="page-section-medium">
            <!-- Search -->
            <div class="search-input-container">
                <SearchInput
                    v-model="searchFilter.search"
                    :full="true"
                    :placeholder="$t('browse.placeholder')"
                    class="search-input"
                    @enter="updateSearchQuery"
                    @delete-query="searchFilter.search = ''"
                />
                <LpiButton
                    :label="$t('browse.page-title')"
                    :secondary="false"
                    @click="updateSearchQuery"
                    data-test="search-input-button"
                ></LpiButton>
            </div>

            <!-- Buttons list -->
            <div class="projects-buttons">
                <LinkButton
                    v-if="announcements.length > 0"
                    :label="$filters.capitalize($t('home.announcements'))"
                    class="btn link"
                    btn-icon="Search"
                    @click="scrollTo('announcements')"
                />
                <LinkButton
                    :label="$filters.capitalize($t('home.all-projects'))"
                    class="btn link"
                    btn-icon="ChartBox"
                    @click="scrollTo('projectList')"
                />
                <LinkButton
                    :label="$filters.capitalize($t('map.projects'))"
                    class="btn"
                    btn-icon="Map"
                    :to="{
                        name: 'map',
                    }"
                />
                <LpiButton
                    v-if="canCreateProject"
                    :label="$t('project.create-project')"
                    class="btn"
                    btn-icon="Plus"
                    secondary
                    @click="$router.push({ name: 'createProject' })"
                    data-test="create-project"
                />
            </div>
        </div>

        <!-- User's projects -->
        <div v-if="isConnected" class="page-section-extra-wide users-project">
            <h2 class="sub-title project-title">{{ $filters.capitalize($t('me.my-projects')) }}</h2>
            <ProjectListSearch
                :privacy-icon-visible="true"
                :search="{
                    limit: 12,
                    ordering: '-updated_at',
                    members: [$store.getters['users/id']],
                    member_role: ['owners', 'members', 'reviewers'],
                }"
                mode="projects"
                :show-pagination="true"
                class="project-list-search"
            >
                <template #default="ProjectListSearchSlotProps">
                    <CardList
                        :desktop-columns-number="6"
                        :is-loading="ProjectListSearchSlotProps.isLoading"
                        :limit="ProjectListSearchSlotProps.limit"
                        :projects="ProjectListSearchSlotProps.projects"
                    >
                        <template #projects="projectListSlotProps">
                            <ProjectCard :project="projectListSlotProps.project" />
                        </template>
                    </CardList>
                </template>
            </ProjectListSearch>
        </div>

        <!-- Onboarding carousel -->
        <div v-else class="carousel page-section-medium">
            <h2 class="sub-title">{{ $filters.capitalize($t('onboarding.title')) }}</h2>
            <HomeCarousel />
        </div>

        <!-- Categories -->
        <div v-if="categories.length > 0" class="categories-container page-section-medium">
            <h2 class="sub-title">{{ $filters.capitalize($t('home.categories.title')) }}</h2>
            <div class="categories">
                <CategoryCard
                    v-for="(category, index) in categories"
                    :key="index"
                    :category="category"
                    class="category"
                    size="small"
                    @go-to="goTo"
                />
            </div>
        </div>

        <!-- Communities -->
        <div v-if="showCommunities" class="page-section-medium">
            <h2 class="sub-title">{{ $filters.capitalize($t('home.communities')) }}</h2>

            <div class="communities-container">
                <CommunityCard
                    v-for="org in filteredOrganizations"
                    :key="org.id"
                    :community="org"
                    class="community"
                />
            </div>
        </div>

        <!-- Project list -->
        <div ref="projectList" class="all-projects-container page-section-extra-wide">
            <h2 class="sub-title">{{ $filters.capitalize($t('home.all-projects')) }}</h2>

            <div class="project-list-search__header">
                <div>
                    <span class="search-by">{{ $t('project_list.sort_by') }}</span>
                    <LpiSelect :options="orderOptions" v-model="orderValue" @input="updateOrder" />
                </div>
            </div>

            <ProjectListSearch
                :search="{ limit: 12, ordering: orderValue }"
                :show-pagination="true"
                mode="projects"
                class="project-list-search"
            >
                <template #default="ProjectListSearchSlotProps">
                    <CardList
                        :desktop-columns-number="6"
                        :is-loading="ProjectListSearchSlotProps.isLoading"
                        :limit="ProjectListSearchSlotProps.limit"
                        :projects="ProjectListSearchSlotProps.projects"
                    >
                        <template #projects="projectListSlotProps">
                            <ProjectCard :project="projectListSlotProps.project" />
                        </template>
                    </CardList>
                </template>
            </ProjectListSearch>
        </div>

        <!-- Announcements -->
        <span id="announcements"></span>
        <div
            v-if="announcements.length > 0"
            ref="announcements"
            class="announcements-container page-section-medium"
        >
            <h2 class="sub-title">{{ $filters.capitalize($t('home.announcements')) }}</h2>

            <AnnouncementCardList
                v-if="announcements.length > 0"
                :announcements="announcements"
                :is-more-toggled="isMoreToggled"
            />
            <div class="announcement-more" v-if="announcements.length > 6">
                <LpiButton
                    :label="
                        $filters.capitalize(isMoreToggled ? $t('common.less') : $t('common.more'))
                    "
                    :btn-icon="PlusOrMinusIcon"
                    @click="isMoreToggled = !isMoreToggled"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CategoryCard from '@/components/lpikit/CategoryCard/CategoryCard.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import AnnouncementCardList from '@/components/project/AnnouncementCard/AnnouncementCardList.vue'
import HomeCarousel from '@/components/lpikit/HomeCarousel/HomeCarousel.vue'
import CommunityCard from '@/components/lpikit/CommunityCard/CommunityCard.vue'
import ProjectListSearch from '@/components/project/ProjectListSearch/ProjectListSearch.vue'
import CardList from '@/components/project/ProjectList/CardList.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'

import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'

import PotatoIcon0 from '@/components/base/media/HomePageAssets/PotatoIcon0.vue'
import PotatoIcon1 from '@/components/base/media/HomePageAssets/PotatoIcon1.vue'
import PotatoIcon2 from '@/components/base/media/HomePageAssets/PotatoIcon2.vue'
import PotatoIcon3 from '@/components/base/media/HomePageAssets/PotatoIcon3.vue'
import PotatoIcon4 from '@/components/base/media/HomePageAssets/PotatoIcon4.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'

import analytics from '@/analytics'

import { getAnnouncements } from '@/api/announcements.service'

import OnboardingTodoBlock from '@/components/lpikit/OnboardingTodoBlock/OnboardingTodoBlock.vue'

export default {
    name: 'HomePage',

    mixins: [imageMixin, permissions],

    components: {
        PotatoIcon0,
        PotatoIcon1,
        PotatoIcon2,
        PotatoIcon3,
        PotatoIcon4,
        HomeCarousel,
        AnnouncementCardList,
        CategoryCard,
        CommunityCard,
        LpiButton,
        LinkButton,
        ProjectListSearch,
        CardList,
        ProjectCard,
        SearchInput,
        LpiSelect,
        OnboardingTodoBlock,
    },

    data() {
        return {
            announcements: [],
            isMoreToggled: false,
            searchFilter: {
                search: '',
            },
            orderValue: 'recommended',
        }
    },

    created() {
        this.$store.dispatch('organizations/getAllOrganizations')
    },

    mounted() {
        this.getAnnouncements()
    },

    computed: {
        organizations() {
            return this.$store.getters['organizations/all']
        },

        organization() {
            return this.$store.getters['organizations/current']
        },

        categories() {
            return this.$store.getters['projectCategories/allOrderedByOrderId']
        },

        PlusOrMinusIcon() {
            return this.isMoreToggled ? 'Minus' : 'Plus'
        },

        showCommunities() {
            return this.organization.children.length > 0
        },

        filteredOrganizations() {
            return this.organizations.filter((org) => this.organization.children.includes(org.code))
        },

        isConnected() {
            return this.$store.getters['users/isConnected']
        },
        orderOptions() {
            return [
                {
                    value: 'recommended',
                    label: this.$t('project_list.recommended'),
                },
                {
                    value: '-updated_at',
                    label: this.$t('project_list.updated_at'),
                },
                {
                    value: 'random',
                    label: this.$t('project_list.random'),
                },
            ]
        },

        showOnbordingTodos() {
            if (!this.isConnected) return false
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
        getAnnouncements() {
            getAnnouncements({
                organizations: [this.organization.code],
                ordering: '-updated_at',
            })
                .then(({ results }) => {
                    this.announcements = results.filter(
                        (announcement) =>
                            announcement.project.publication_status !== 'private' &&
                            (!announcement.deadline ||
                                new Date(announcement.deadline) >= new Date().setHours(0, 0, 0, 0))
                    )
                })
                .catch((err) => {
                    console.error(err)
                })
        },

        goTo(id) {
            this.$router.push({ name: 'Category', params: { id: id } })
        },

        scrollTo(id) {
            const el = this.$refs[id]

            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updateSearchQuery() {
            this.$router.push({
                name: 'Search',
                query: this.searchFilter,
            })
        },
        updateOrder(value) {
            this.orderValue = value
            analytics.project.updateSort(value)
        },
    },
}
</script>

<style lang="scss" scoped>
.home-page {
    overflow: hidden;

    .potato-ctn {
        position: relative;
    }

    .potato {
        position: absolute;
        z-index: -1;

        &--potato0 {
            left: 0;
            top: pxToRem(180px);
        }

        &--potato1 {
            right: 0;
            top: pxToRem(180px);
        }

        &--potato2 {
            right: 0;
            top: pxToRem(1030px);

            @media screen and (min-width: $min-desktop) {
                right: pxToRem(-45px);
            }
        }

        &--potato3 {
            left: 0;
            top: pxToRem(1740px);
        }

        &--potato4 {
            right: 0;
            top: pxToRem(2600px);
        }
    }
}

.logo-container {
    display: flex;
    justify-content: center;
    margin-top: $space-2xl;
    position: relative;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-3xl;

    .organization-logo {
        z-index: -1;
        max-width: 100%;
        max-height: pxToRem(120px);
        height: auto;
        width: auto;
        margin-bottom: $space-2xl;
        margin-top: $space-2xl;
    }

    .main-title {
        padding-top: $space-m;
        font-weight: 700;
        font-size: $font-size-4xl;
        line-height: 1;
        text-align: center;

        @media screen and (min-width: $min-desktop) {
            font-size: $font-size-7xl;
        }
    }
}

.search-input-container {
    display: flex;
    padding: $space-l;
    margin-top: $space-l;
    margin-bottom: $space-l;
    background: $primary-lighter;
    align-items: center;
    border-radius: $border-radius-17;
    flex-direction: column;

    .search-input {
        margin-bottom: pxToRem(16px);
    }

    @media screen and (min-width: $min-tablet) {
        padding: $space-xl 84px $space-xl 84px;
        margin-top: $space-2xl;
        margin-bottom: 0;
        border-radius: $border-radius-17;
        flex-direction: row;

        .search-input {
            margin-right: $space-l;
            margin-bottom: 0;
        }
    }
}

.projects-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: $space-3xl;
    align-items: center;
    gap: $space-2xs;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        margin-top: $space-l;
        margin-bottom: $space-3xl;
        justify-content: space-between;
    }

    .btn {
        &.link {
            padding-left: 0 !important;
            padding-right: 0 !important;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}

.search {
    margin: $space-2xl $space-2xl $space-l $space-2xl;
    padding: $space-xl;
    background: $primary-lighter;
    border-radius: 16px;
}

.categories-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    margin-top: $space-xl;
    margin-bottom: $space-3xl;

    .categories {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        gap: calc($space-s * 2);

        @media screen and (min-width: $min-tablet) {
            gap: $space-2xl;
        }
    }
}

.communities-container {
    $community-card-width: pxToRem(280px);
    $community-card-gap: $space-m;

    display: flex;
    place-content: center space-between;
    flex-wrap: wrap;
    margin-bottom: $space-3xl;
    gap: $community-card-gap;

    // + 2 * $space-xl is the .page-section-medium padding
    @media screen and (max-width: (2 * $community-card-width + $community-card-gap + 2 * $space-xl)) {
        justify-content: center;
    }

    .community {
        width: $community-card-width;
        height: pxToRem(100px);
    }
}

.sub-title {
    text-align: center;
    font-weight: 700;
    font-size: $font-size-3xl;
    line-height: 40px;
    color: $black;
    width: 100%;
    margin-bottom: pxToRem(60px);
}

.all-projects-container {
    margin-bottom: $space-3xl;
}

.announcements-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-3xl;
}

.carousel {
    display: flex;
    flex-direction: column;
    margin-top: $space-xl;
    margin-bottom: $space-xl;

    @media screen and (min-width: $min-tablet) {
        margin-top: $space-xl;
        margin-bottom: $space-3xl;
    }

    .carousel-title {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: bold;
        color: $black;
        padding-bottom: calc($space-m + $space-s);
    }
}

.users-project {
    display: flex;
    flex-direction: column;
    margin-bottom: $space-3xl;

    .project-title {
        margin-bottom: $space-l;
    }
}

.announcement-more {
    margin-top: $space-l;
    margin-bottom: $space-l;
}

.project-list-search__header {
    color: $primary-dark;
    font-size: $font-size-m;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: $space-l 0;

    .search-by {
        margin-right: $space-m;
    }

    @media screen and (min-width: $max-tablet) {
        justify-content: flex-end;
    }

    :deep(.lpi-select) {
        margin-left: $space-m;
    }

    &--search-input {
        justify-content: space-between;
        padding: $space-l;
    }
}
</style>
