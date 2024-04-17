<template>
    <!-- oboarding todos -->
    <OnboardingTodoBlock v-if="showOnbordingTodos" />
    <div v-if="loggedIn">
        <div class="page-section-medium title-container">
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>
        <!-- TODO keepin for testing purpose to remove when all is set -->
        <!-- div class="debug" style="background-color: rgba(255, 0, 0, 1); text-align: center">
            <label>
                projects <input v-model="summaryMaxProjects" type="number" min="0" max="3"
            /></label>
            <label>
                events <input v-model="summaryMaxEvents" type="number" min="0" max="3"
            /></label>

            <label>
                insturctions <input v-model="summaryMaxInstructions" type="number" min="0" max="1"
            /></label>
        </div -->
        <div
            v-if="summaryCardsExist && !isLoading"
            class="summary-cards"
            data-test="home-user-header"
        >
            <div class="summary-container page-section-wide">
                <ProjectSummaryBlock
                    :projects="displayableProjects"
                    :inlined="numberOfSummaryBlock < 2"
                />

                <EventSummaryBlock
                    :events="displayableEvents"
                    v-if="displayableEvents.length"
                    :inlined="numberOfSummaryBlock < 2"
                    @reload-events="loadEvents"
                />
                <InstructionSummaryBlock
                    :instructions="displayableInstructions"
                    v-if="displayableInstructions.length"
                    :inlined="numberOfSummaryBlock < 2"
                    @reload-instructions="loadInstructions"
                />
            </div>
        </div>
        <LpiLoader v-else class="loading" type="simple" />
    </div>
    <div v-else class="page-section-full introduction" data-test="home-organization-header">
        <div v-if="organization && organization.banner_image" class="banner-image">
            <h1 class="mobile-not-connected-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <div class="banner-wrapper">
                <img :src="organization.banner_image.url" alt="logo" class="organization-banner" />
            </div>
            <div class="introduction-container">
                <h1 class="image-main-title">
                    {{ organization.dashboard_title }}
                </h1>
                <div class="introduction-text">
                    {{ organization.dashboard_subtitle }}
                </div>
                <div class="image-account-buttons">
                    <LpiButton :label="$t('home.login')" :secondary="false" @click="logInUser" />
                    <LpiButton
                        :label="$t('home.account-request')"
                        :secondary="true"
                        class="login-button"
                        @click="$router.push({ name: 'RequestAccess' })"
                    />
                </div>
            </div>
        </div>
        <div v-else class="banner">
            <h1 class="centered-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <div class="centered-introduction">
                {{ organization.dashboard_subtitle }}
            </div>
            <div class="account-buttons">
                <LpiButton :label="$t('home.login')" :secondary="false" />
                <LpiButton
                    :label="$t('home.account-request')"
                    :secondary="true"
                    class="login-button"
                />
            </div>
        </div>
    </div>
    <div class="page-section-medium">
        <div class="search-input-container">
            <SearchOptions
                class="search-options"
                :show-section-filter="true"
                :search-button="true"
                @search="goTo"
            ></SearchOptions>
        </div>
    </div>
    <div class="page-section-wide bottom-page">
        <div class="projects-and-people">
            <ProjectCategoriesDropdown />
            <div v-if="loggedIn" class="home-buttons">
                <HomeButtons :buttons="homeButtons" />
            </div>
            <div class="recommandations">
                <RecommendationBlock :organization="organization" :logged-in="loggedIn" />
            </div>
        </div>
        <div class="all-news">
            <div class="select-news"></div>
            <div class="news">
                <div v-if="topNews" class="top-news"></div>
                <div class="other-news">
                    <HomeNews :organization="organization" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ProjectCategoriesDropdown from '@/components/lpikit/Dropdown/ProjectCategoriesDropdown.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'
import RecommendationBlock from '@/components/lpikit/Recommendations/RecommendationBlock.vue'
import HomeButtons from '@/components/lpikit/HomeButtons/HomeButtons.vue'
import HomeNews from '@/components/lpikit/HomeNews/HomeNews.vue'
import ProjectSummaryBlock from '@/components/lpikit/SummaryCards/ProjectSummaryBlock.vue'
import EventSummaryBlock from '@/components/lpikit/SummaryCards/EventSummaryBlock.vue'
import InstructionSummaryBlock from '@/components/lpikit/SummaryCards/InstructionSummaryBlock.vue'
import { searchProjects } from '@/api/projects.service'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import OnboardingTodoBlock from '@/components/lpikit/OnboardingTodoBlock/OnboardingTodoBlock.vue'
import { getAllEvents } from '@/api/event.service'
import { getAllInstructions } from '@/api/instruction.service'

export default {
    name: 'NewHomePage',

    mixins: [imageMixin, permissions],

    components: {
        SearchOptions,
        LpiButton,
        ProjectCategoriesDropdown,
        RecommendationBlock,
        HomeButtons,
        HomeNews,
        LpiLoader,
        ProjectSummaryBlock,
        EventSummaryBlock,
        InstructionSummaryBlock,
        OnboardingTodoBlock,
    },

    data() {
        return {
            open_categories: false,
            recommendations: [],
            isLoading: true,
            homeButtons: [
                {
                    label: this.$t('home.new-project'),
                    action: () => this.$router.push({ name: 'createProject' }),
                    dataTest: 'create-project',
                },
            ],
            topNews: null,
            projects: [],
            events: [],
            instructions: [],
            summaryCardsExist: false,
            summaryMaxEvents: 3,
            summaryMaxProjects: 3,
            summaryMaxInstructions: 1,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },

        loggedIn() {
            return this.$store.getters['users/isLoggedIn']
        },

        displayableEvents() {
            return this.events?.slice(0, this.summaryMaxEvents) || []
        },

        displayableInstructions() {
            return this.instructions.slice(0, this.summaryMaxInstructions)
        },

        displayableProjects() {
            return this.projects.slice(0, this.summaryMaxProjects)
        },

        numberOfSummaryBlock() {
            let res = 0
            if (this.loggedIn) res++ // my projects block always visible (at leat create project button)
            if (this.displayableEvents.length > 0) res++
            if (this.displayableInstructions.length > 0) res++

            return res
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

    async mounted() {
        const filters = {
            limit: 3,
            ordering: '-updated_at',
            members: [this.$store.getters['users/id']],
            member_role: ['owners', 'members', 'reviewers'],
            organizations: this.$store.getters['organizations/current'].code,
        }
        const response = await searchProjects('', filters)
        this.projects = response.results

        this.summaryCardsExist = this.loggedIn // && this.projects.length > 0

        await Promise.all([this.loadEvents(), this.loadInstructions()])

        this.isLoading = false
    },

    methods: {
        goTo(section, filters) {
            this.$router.push({ name: 'Search', query: { section, ...filters } })
        },

        logInUser() {
            goToKeycloakLoginPage()
        },

        async loadEvents() {
            this.events = (
                await getAllEvents(this.$store.getters['organizations/current']?.code, {
                    ordering: '+event_date',
                })
            ).results
        },

        async loadInstructions() {
            this.instructions = (
                await getAllInstructions(this.$store.getters['organizations/current']?.code, {
                    ordering: '+publication_date',
                    limit: 1,
                })
            ).results
        },
    },
}
</script>

<style lang="scss" scoped>
.title-container {
    margin-top: $space-3xl;
    margin-bottom: $space-l;
}

.loading {
    display: flex;
    justify-content: center;
    padding-top: $space-l;
}

.introduction {
    margin-top: $space-3xl;
    margin-bottom: $space-2xl;

    .mobile-not-connected-main-title {
        font-size: $font-size-xl;
        text-align: center;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }

    .banner-image {
        display: flex;
        flex-direction: column;
        gap: $space-l;

        @media screen and (min-width: $min-tablet) {
            flex-direction: row;
            gap: $space-2xl;
        }

        .banner-wrapper {
            @media screen and (min-width: $min-tablet) {
                flex-basis: 60%;
                flex-shrink: 0;
            }
        }

        .organization-banner {
            width: 100%;

            @media screen and (min-width: $min-tablet) {
                margin-bottom: 0;
                margin-right: $space-2xl;
            }
        }

        .introduction-container {
            flex-direction: column;

            .image-main-title {
                display: none;
            }

            @media screen and (min-width: $min-tablet) {
                .image-main-title {
                    display: flex;
                    font-weight: 700;
                    font-size: $font-size-4xl;
                    margin-bottom: $space-l;
                }
            }

            .image-account-buttons {
                display: flex;
                margin-top: $space-l;
            }
        }
    }

    .banner {
        margin-inline: 0;
        padding-inline: 0;
        border: 1px solid red;

        @media screen and (min-width: $min-tablet) {
            margin-inline: $space-3xl;
            padding-inline: $space-3xl;
        }

        .centered-main-title {
            font-weight: 700;
            font-size: $font-size-xl;
            text-align: center;
            margin-bottom: $space-xl;

            @media screen and (min-width: $min-tablet) {
                font-size: $font-size-4xl;
                margin-bottom: $space-l;
            }
        }

        .centered-introduction {
            text-align: center;
        }

        .account-buttons {
            display: flex;
            justify-content: center;
            margin-top: $space-l;
        }
    }
}

.login-button {
    margin-left: $space-s;
}

.main-title {
    font-weight: 700;
    font-size: $font-size-xl;
    text-align: center;

    @media (min-width: $min-tablet) {
        padding-top: $space-m;
        font-weight: 700;
        font-size: $font-size-4xl;
        line-height: 1;
        text-align: center;
    }
}

.summary-cards {
    padding-inline: 0;

    .summary-container {
        background-color: $green-lighter;

        @media screen and (min-width: $min-tablet) {
            padding: $space-l;
            display: flex;
            gap: $space-unit;
            align-items: flex-start;

            & > :deep(*) {
                flex-basis: 33%;
                flex-grow: 1;
            }
        }
    }
}

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
    }
}

.projects-and-people {
    margin-bottom: $space-xl;

    @media (min-width: $min-tablet) {
        flex-basis: 35%;
        margin-bottom: 0;
        flex-shrink: 0;
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

    .home-buttons {
        margin-top: $space-l;
        background-color: $primary-lighter;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        padding-block: $space-s;
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
        flex-shrink: 0;
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
