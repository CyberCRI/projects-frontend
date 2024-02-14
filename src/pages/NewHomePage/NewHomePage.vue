<template>
    <div v-if="$store.getters['users/isLoggedIn']">
        <div class="page-section-medium title-container">
            <h1 class="main-title">{{ organization.dashboard_title }}</h1>
        </div>
        <div class="page-section-wide summary-cards">
            <div class="summary-container"></div>
        </div>
    </div>
    <div v-else class="page-section-wide introduction">
        <div v-if="organization && organization.banner_image" class="banner-image">
            <h1 class="mobile-not-connected-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <img :src="organization.banner_image.url" alt="logo" class="organization-banner" />
            <div class="introduction-container">
                <h1 class="image-main-title">
                    {{ organization.dashboard_title }}
                </h1>
                <div class="introduction-text">
                    {{ organization.dashboard_subtitle }}
                </div>
                <div class="image-account-buttons">
                    <LpiButton :label="$t('home.login')" :secondary="false" />
                    <LpiButton
                        :label="$t('home.account-request')"
                        :secondary="true"
                        class="login-button"
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
            <div class="categories"></div>
            <div class="new-project"></div>
            <div class="recommandations"></div>
        </div>
        <div class="all-news">
            <div class="select-news"></div>
            <div class="news">
                <div class="top-news"></div>
                <div class="other-news"></div>
            </div>
            <div class="see-all">
                <LpiButton :label="$t('feed.see-all')" :secondary="false"> </LpiButton>
            </div>
        </div>
    </div>
</template>

<script>
import SearchOptions from '@/components/lpikit/SearchOptions/SearchOptions.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

import imageMixin from '@/mixins/imageMixin.ts'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'NewHomePage',

    mixins: [imageMixin, permissions],

    components: {
        SearchOptions,
        LpiButton,
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    methods: {
        goTo(section, filters) {
            console.log(filters)
            this.$router.push({ name: 'Search', query: { section, ...filters } })
        },
    },
}
</script>

<style lang="scss" scoped>
.title-container {
    margin-top: $space-3xl;
    margin-bottom: $space-l;
}

.introduction {
    margin-top: $space-3xl;
    margin-bottom: $space-2xl;

    .mobile-not-connected-main-title {
        font-size: $font-size-xl;
        text-align: center;
        margin-bottom: $space-xl;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }

    .banner-image {
        display: flex;
        border: 1px solid red;
        flex-direction: column;

        @media screen and (min-width: $min-tablet) {
            flex-direction: row;
        }

        .organization-banner {
            margin-bottom: $space-l;

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

    @media (min-width: $min-tablet) {
        padding: $space-l;
    }

    .summary-container {
        border: 1px solid red;
        height: 240px;
        background-color: $green-lighter;
    }
}

.search-input-container {
    display: flex;
    padding-top: $space-l;
    padding-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: row;

    @media (min-width: $min-tablet) {
        padding-left: $space-3xl;
        padding-right: $space-3xl;
    }
}

.search-options {
    position: relative;
    cursor: pointer;
}

.search-options {
    padding-top: 15px;
}

.bottom-page {
    display: flex;
    margin-bottom: $space-l;
    border-radius: $border-radius-17;
    flex-direction: column;

    @media (min-width: $min-tablet) {
        flex-direction: row;
    }
}

.projects-and-people {
    border: 1px solid red;
    margin-bottom: $space-xl;

    @media (min-width: $min-tablet) {
        width: 30%;
        margin-right: $space-l;
        margin-bottom: 0;
    }

    .categories {
        border: 1px solid purple;
        height: 50px;

        @media (min-width: $min-tablet) {
            margin-top: $space-l;
        }
    }

    .new-project {
        height: 72px;
        margin-top: $space-l;
        border: 1px solid blue;
    }

    .recommandations {
        height: 793px;
        margin-top: $space-l;
        border: 1px solid pink;
    }
}

.all-news {
    border: 1px solid green;
    height: fit-content;

    @media (min-width: $min-tablet) {
        width: 70%;
        margin-left: $space-l;
    }

    .select-news {
        height: $space-l;
        border: 1px solid blue;
    }

    .news {
        border: 1px solid green;
        height: fit-content;

        .top-news {
            height: 274px;
            border: 1px solid red;
        }

        .other-news {
            height: 160px;
            margin-top: $space-l;
            border: 1px solid orange;
        }
    }

    .see-all {
        display: flex;
        justify-content: center;
        margin-top: $space-l;
    }
}
</style>
