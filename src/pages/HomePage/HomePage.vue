<template>
    <div class="home-page">
        <PotatoIcon0 class="potato potato--potato0" />
        <PotatoIcon1 class="potato potato--potato1" />
        <div class="potato-ctn">
            <PotatoIcon2 class="potato potato--potato2" />
        </div>
        <PotatoIcon3 class="potato potato--potato3" />
        <PotatoIcon4 class="potato potato--potato4" />

        <!-- Logo and text -->
        <div class="logo-container">
            <img
                v-if="organization && organization.logo_image"
                :src="organization.logo_image.url"
                alt=""
                class="organization-logo"
            />
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>

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
            <LpiButton
                v-if="announcements.length > 0"
                :label="$filters.capitalize($t('home.announcements'))"
                class="btn link"
                left-icon="Search"
                size="link"
                @click="scrollTo('announcements')"
            />
            <LpiButton
                :label="$filters.capitalize($t('home.all-projects'))"
                class="btn link"
                left-icon="ChartBox"
                size="link"
                @click="scrollTo('projectList')"
            />
            <LpiButton
                :label="$filters.capitalize($t('map.projects'))"
                class="btn"
                left-icon="Map"
                secondary
                size="link"
                @click="$router.push('map')"
            />
            <LpiButton
                v-if="canCreateProject"
                :label="$t('project.create-project')"
                class="btn"
                left-icon="Plus"
                secondary
                @click="$router.push({ name: 'createProject' })"
                data-test="create-project"
            />
        </div>

        <!-- User's projects -->
        <div v-if="isConnected" class="users-project">
            <h2 class="sub-title project-title">{{ $filters.capitalize($t('me.my-projects')) }}</h2>
            <ProjectListSearch
                :privacy-icon-visible="true"
                :search="{
                    limit: 12,
                    ordering: '-updated_at',
                    members: [$store.state.users.keycloak_id],
                    member_role: ['owners', 'members', 'reviewers'],
                }"
                mode="projects"
                :show-pagination="true"
                class="project-list-search narrow-body"
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
        <div v-else class="carousel">
            <h2 class="sub-title">{{ $filters.capitalize($t('onboarding.title')) }}</h2>
            <HomeCarousel />
        </div>

        <!-- Categories -->
        <div v-if="categories.length > 0" class="categories-container narrow-body">
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
        <div v-if="showCommunities">
            <h2 class="sub-title">{{ $filters.capitalize($t('home.communities')) }}</h2>

            <div class="communities-container narrow-body">
                <CommunityCard
                    v-for="org in filteredOrganizations"
                    :key="org.id"
                    :community="org"
                    class="community"
                />
            </div>
        </div>

        <!-- Project list -->
        <div ref="projectList" class="all-projects-container narrow-body">
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
            class="announcements-container narrow-body"
        >
            <h2 class="sub-title">{{ $filters.capitalize($t('home.announcements')) }}</h2>

            <AnnouncementCardList
                v-if="announcements.length > 0"
                :announcements="announcements"
                :is-more-toggled="isMoreToggled"
            />
            <div class="announcement-more">
                <LpiButton
                    :label="
                        $filters.capitalize(isMoreToggled ? $t('common.less') : $t('common.more'))
                    "
                    :left-icon="PlusOrMinusIcon"
                    @click="isMoreToggled = !isMoreToggled"
                />
            </div>
        </div>
    </div>
</template>

<script>
import CategoryCard from '@/components/lpikit/CategoryCard/CategoryCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import AnnouncementCardList from '@/components/lpikit/AnnouncementCard/AnnouncementCardList.vue'
import HomeCarousel from '@/components/HomeCarousel/HomeCarousel.vue'
import CommunityCard from '@/components/lpikit/CommunityCard/CommunityCard.vue'
import ProjectListSearch from '@/components/lpikit/ProjectListSearch/ProjectListSearch.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import SearchInput from '@/components/lpikit/SearchInput/SearchInput.vue'

import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'

import PotatoIcon0 from '@/components/svgs/HomePageAssets/PotatoIcon0.vue'
import PotatoIcon1 from '@/components/svgs/HomePageAssets/PotatoIcon1.vue'
import PotatoIcon2 from '@/components/svgs/HomePageAssets/PotatoIcon2.vue'
import PotatoIcon3 from '@/components/svgs/HomePageAssets/PotatoIcon3.vue'
import PotatoIcon4 from '@/components/svgs/HomePageAssets/PotatoIcon4.vue'
import LpiSelect from '@/components/lpikit/LpiSelect/LpiSelect.vue'

import analytics from '@/analytics'

import { getAnnouncements } from '@/api/announcements.service'

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
        ProjectListSearch,
        CardList,
        ProjectCard,
        SearchInput,
        LpiSelect,
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
        this.$store.dispatch('app/updateLoading', { visible: false })
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
            this.$router.push(`/category/${id}`)
        },

        scrollTo(id) {
            const el = this.$refs[id]

            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updateSearchQuery() {
            this.$router.push({
                path: '/search',
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
    flex-direction: column;
    align-items: center;
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
    padding: $space-s;

    @media screen and (min-width: $min-desktop) {
        margin-right: 25%;
        margin-left: 25%;
    }

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
    margin: $space-l;
    background: #ebfffa;
    align-items: center;
    border-radius: $border-radius-17;
    flex-direction: column;

    .search-input {
        margin-bottom: pxToRem(16px);
    }

    @media screen and (min-width: $min-tablet) {
        width: 50%;
        padding: $space-xl 84px $space-xl 84px;
        margin: $space-2xl auto 0 auto;
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

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        margin: $space-l auto $space-3xl auto;
        width: calc(50% + (2 * 84px));
        justify-content: space-between;
    }

    .btn {
        margin: $space-2xs;

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
    background: #ebfffa;
    border-radius: 16px;
}

.categories-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    margin: $space-xl auto $space-3xl;

    .categories {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;

        .category {
            margin: calc($space-s * 2);
        }

        @media screen and (min-width: $min-tablet) {
            margin: $space-2xl;
        }
    }
}

.communities-container {
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: $space-3xl;
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
    width: 100%;
    margin-bottom: $space-3xl;
}

.community {
    margin: $space-m;
    width: pxToRem(280px);
    height: pxToRem(100px);
}

.announcements-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-3xl;
}

.carousel {
    display: flex;
    flex-direction: column;
    margin: $space-xl;

    @media screen and (min-width: $min-tablet) {
        margin: $space-xl pxToRem(150px) $space-3xl;
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
