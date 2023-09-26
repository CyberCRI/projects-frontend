<template>
    <div class="page404">
        <div class="content">
            <div class="banner-404">
                <h1 class="title">{{ title }}</h1>
                <i18n-t :keypath="searchDescriptionPath" class="notice" tag="p">
                    <router-link v-if="isConnected" :to="{ name: 'Search' }"
                        >{{ $t('page404.search-again') }}
                    </router-link>
                    <a v-else href="" @click="login">{{ $t('page404.not-connected.login') }}</a>
                </i18n-t>
                <i18n-t class="notice" keypath="page404.contact" tag="p">
                    <a :href="`mailto:${$t('page404.contact-mail')}`">
                        {{ $t('page404.contact-mail') }}
                    </a>
                </i18n-t>
                <LpiButton
                    v-if="!isConnected"
                    :label="$filters.capitalize($t('common.login'))"
                    @click="login"
                />
                <div class="illustration">
                    <img :src="`${PUBLIC_BINARIES_PREFIX}${illustrationSrc}`" />
                    <a :class="{ 'text--connected': !isConnected }" class="text" @click="login">
                        {{ illustrationText }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import imageMixin from '@/mixins/imageMixin.ts'
import pageTitle from '@/mixins/pageTitle.ts'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'ErrorPage',
    components: { LpiButton },

    mixins: [imageMixin, pageTitle],

    pageTitle() {
        return this.$t('page404.page-title')
    },

    mounted() {
        this.$store.dispatch('app/updateLoading', { visible: false })
    },

    beforeUnmount() {
        document.title = 'Projects'
    },

    computed: {
        isConnected() {
            return this.$store.getters['users/isConnected']
        },

        title() {
            return this.isConnected
                ? this.$t('page404.title')
                : this.$t('page404.not-connected.title')
        },

        searchDescriptionPath() {
            return this.isConnected ? 'page404.search' : 'page404.not-connected.connect'
        },

        illustrationSrc() {
            return this.isConnected
                ? '/page404/page-404.png'
                : '/page404/not-connected-page-404.png'
        },

        illustrationText() {
            return this.isConnected
                ? this.$t('page404.illustration-text')
                : this.$t('page404.not-connected.illustration-text')
        },
    },

    methods: {
        login() {
            goToKeycloakLoginPage()
        },
    },
}
</script>
<style lang="scss" scoped>
.page404 {
    display: flex;
    flex-flow: column nowrap;

    .content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        background: #fff;
        flex: 1 1 50%;
        margin-top: pxToRem(92px);
        margin-bottom: pxToRem(92px);
    }

    .banner-404 {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        flex-shrink: 1;
        width: pxToRem(832px);

        .title {
            font-size: pxToRem(40px);
            font-weight: 900;
            color: $primary-dark;
            line-height: 1.125;
            margin-bottom: pxToRem(28px);
        }

        .notice {
            text-align: center;

            & + .notice {
                margin-top: 1em;
                font-size: $font-size-m;
                line-height: 1.2;
                margin-bottom: $space-l;
            }

            a {
                font-weight: 700;
                color: $primary-dark;
                text-decoration: underline;
            }
        }

        .illustration {
            margin: pxToRem(42px) pxToRem(62px) 0;
            position: relative;

            img {
                border-radius: pxToRem(16px);
            }

            .text {
                position: absolute;
                left: pxToRem(88px);
                right: pxToRem(88px);
                bottom: pxToRem(57px);
                font-size: pxToRem(40px);
                line-height: pxToRem(30px);
                text-align: center;
                color: $green;
                font-weight: 700;
                filter: drop-shadow(8px 0 0 #20393d) drop-shadow(-8px 0 0 #20393d)
                    drop-shadow(0 8px 0 #20393d) drop-shadow(0 -8px 0 #20393d);

                &--connected {
                    bottom: pxToRem(313px);
                }
            }
        }
    }
}
</style>
