<template>
    <div class="page-section-medium introduction" data-test="home-organization-header">
        <div class="banner">
            <h1 class="mobile-not-connected-main-title">
                {{ organization.dashboard_title }}
            </h1>
            <div class="banner-wrapper" v-if="hasBannerImage">
                <CroppedImage
                    alt="welcome image"
                    :image-sizes="bannerImageSizes"
                    :src="bannerUrl"
                    class="organization-banner"
                    :ratio="1 / 1"
                />
            </div>
            <div
                class="introduction-container"
                :class="{ 'with-image': hasBannerImage, 'without-image': !hasBannerImage }"
            >
                <h1 class="image-main-title">
                    {{ organization.dashboard_title }}
                </h1>
                <div
                    v-if="showLessDescription"
                    :style="styleDescription"
                    class="description-limited"
                >
                    <HtmlLimiter
                        :html="organization.description || ''"
                        :striped-tags="['table']"
                        class="introduction-text homepage-introduction-text"
                        @computed="descriptionLayoutComputed"
                        @computing="computeDescriptionLayout"
                    />
                </div>
                <div
                    v-else
                    class="introduction-text homepage-introduction-text"
                    v-html="organization.description || ''"
                ></div>
                <div class="description-toggle">
                    <LinkButton
                        v-if="!descriptionComputed || isDescriptionLimited"
                        class="toggle-description-button"
                        :label="showLessDescription ? $t('common.see-more') : $t('common.see-less')"
                        :secondary="false"
                        :btn-icon="showLessDescription ? 'ChevronDown' : 'ChevronUp'"
                        @click="showLessDescription = !showLessDescription"
                    />
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
    </div>
</template>
<script>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
export default {
    name: 'HomeHeaderAnonymous',
    components: {
        CroppedImage,
        HtmlLimiter,
        LpiButton,
        LinkButton,
    },

    data() {
        return {
            styleDescription: {},
            isDescriptionLimited: false,
            showLessDescription: true,
            descriptionComputed: false,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
        bannerUrl() {
            return this.organization?.banner_image?.variations?.medium
        },

        bannerImageSizes() {
            return pictureApiToImageSizes(this.organization?.banner_image)
        },
        hasBannerImage() {
            return this.organization && this.organization.banner_image
        },
    },
    methods: {
        computeDescriptionLayout() {
            this.styleDescription = { height: `${this.heightLimit}px` }
            this.descriptionComputed = false
        },
        descriptionLayoutComputed(event) {
            this.styleDescription = { height: event.height + 'px' }
            this.isDescriptionLimited = event.croppedHtml != this.organization.description
            this.descriptionComputed = true
        },
        logInUser() {
            goToKeycloakLoginPage()
        },
    },
}
</script>
<style lang="scss" scoped>
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

    .banner {
        display: flex;
        flex-direction: column;
        gap: $space-l;

        @media screen and (min-width: $min-tablet) {
            flex-direction: row;
            gap: $space-2xl;
            align-items: stretch;
        }

        .banner-wrapper {
            @media screen and (min-width: $min-tablet) {
                flex-basis: 30%;
                flex-shrink: 0;
            }
        }

        .organization-banner {
            width: 100%;
            aspect-ratio: 1;
            border-radius: pxToRem(8px);

            @media screen and (min-width: $min-tablet) {
                margin-bottom: 0;
                margin-right: $space-2xl;
            }
        }

        .introduction-container {
            display: flex;
            flex-flow: column nowrap;
            flex-grow: 1;

            &.without-image {
                align-items: center;
                max-width: 50rem;
                margin: 0 auto;
            }

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
}

.login-button {
    margin-left: $space-s;
}

.description-toggle {
    display: flex;
    justify-content: center;

    .toggle-description-button {
        padding-left: 0 !important;
    }
}

.description-limited {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    align-self: stretch;

    @media screen and (max-width: $min-tablet) {
        height: 8rem;
    }
}

.without-image .description-limited {
    height: 6rem;
}
</style>
