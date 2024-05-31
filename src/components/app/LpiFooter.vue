<template>
    <footer id="footer" class="page-section-full">
        <div class="directory-ctn" v-if="!isRegisterPage && showDirectoryLink">
            <p v-if="showDirectoryLink" class="content">
                {{ $t('footer.directory') }}
                <a class="link" href="https://projects.directory" target="_blank"
                    >https://projects.directory</a
                >
            </p>

            <ProjectLogo v-if="showDirectoryLink" class="logo" />
            <div v-else class="no-logo"></div>
        </div>
        <div class="footer-content">
            <div class="footer-lists">
                <ul class="footer-links">
                    <li v-if="canOpen" class="list-item">
                        <RouterLink to="/legal-notices"
                            >{{ $t('footer.legal-notices') }}
                        </RouterLink>
                    </li>
                    <li v-else>
                        <FooterEnglishTips ref="copy-link-tooltip" item-title="legal notices">
                            <RouterLink to="/legal-notices"
                                >{{ $t('footer.legal-notices') }}
                            </RouterLink>
                        </FooterEnglishTips>
                    </li>

                    <li v-if="canOpen" class="list-item">
                        <RouterLink to="/personal-data"
                            >{{ $t('footer.personal-data') }}
                        </RouterLink>
                    </li>
                    <li v-else>
                        <FooterEnglishTips ref="copy-link-tooltip" item-title="protection policy">
                            <RouterLink to="/personal-data"
                                >{{ $t('footer.personal-data') }}
                            </RouterLink>
                        </FooterEnglishTips>
                    </li>
                </ul>

                <ul class="footer-links">
                    <li v-if="canOpen" class="list-item">
                        <RouterLink to="/terms-of-service">
                            {{ $t('footer.terms-of-service') }}
                        </RouterLink>
                    </li>
                    <li v-else>
                        <FooterEnglishTips ref="copy-link-tooltip" item-title="terms of use">
                            <RouterLink to="/terms-of-service"
                                >{{ $t('footer.terms-of-service') }}
                            </RouterLink>
                        </FooterEnglishTips>
                    </li>

                    <li v-if="canOpen" class="list-item">
                        <RouterLink to="/cookies">{{ $t('footer.cookies') }}</RouterLink>
                    </li>
                    <li v-else>
                        <FooterEnglishTips ref="copy-link-tooltip" item-title="cookies">
                            <RouterLink to="/cookies">{{ $t('footer.cookies') }}</RouterLink>
                        </FooterEnglishTips>
                    </li>
                </ul>

                <ul class="footer-links">
                    <li v-if="canOpen" class="list-item">
                        <RouterLink to="/accessibility"
                            >{{ $t('footer.accessibility') }}
                        </RouterLink>
                    </li>
                    <li v-else>
                        <FooterEnglishTips ref="copy-link-tooltip" item-title="accessibility">
                            <RouterLink to="/accessibility"
                                >{{ $t('footer.accessibility') }}
                            </RouterLink>
                        </FooterEnglishTips>
                    </li>

                    <li class="list-item">
                        <RouterLink to="/help">{{ $t('footer.help') }}</RouterLink>
                    </li>
                </ul>
                <ul class="footer-links">
                    <li class="list-item">
                        <a @click.prevent="reportBugOpen = true">{{ $t('report.bug') }}</a>
                    </li>
                    <li class="list-item">
                        <a href="#" @click.prevent="showContactUsDrawer = true">{{
                            $t('footer.contact')
                        }}</a>
                    </li>
                </ul>
            </div>

            <div class="creators">
                <div>
                    <p class="projects">{{ $t('footer.projects') }}</p>
                    <p v-if="appVersion">{{ appVersion }}</p>
                    <p>{{ $t('footer.madeBy') }}</p>
                </div>

                <LpiLogo class="lpi-logo" />
            </div>
        </div>

        <ContactDrawer :is-opened="showContactUsDrawer" @close="showContactUsDrawer = false" />

        <ReportDrawer :is-opened="reportBugOpen" type="bug" @close="reportBugOpen = false" />

        <OnboardingScreens v-if="showOnboardingScreen && isConnected"> </OnboardingScreens>
    </footer>
</template>

<script>
import LpiLogo from '@/components/app/LpiLogo.vue'
import ReportDrawer from '@/components/app/ReportDrawer.vue'
import ContactDrawer from '@/components/app/ContactDrawer.vue'
import ProjectLogo from '@/components/base/media/ProjectLogo.vue'
import FooterEnglishTips from '@/components/app/FooterEnglishTips.vue'
import OnboardingScreens from '@/components/onboarding/OnboardingScreens/OnboardingScreens.vue'
export default {
    name: 'LpiFooter',

    components: {
        LpiLogo,
        ReportDrawer,
        ContactDrawer,
        ProjectLogo,
        OnboardingScreens,
        FooterEnglishTips,
    },

    data() {
        return {
            reportBugOpen: false,
            showContactUsDrawer: false,
        }
    },

    computed: {
        canOpen() {
            return this.$store.state.languages.current === 'fr'
        },
        showDirectoryLink() {
            const organization = this.$store.getters['organizations/current']
            if (organization && organization.code === 'DEFAULT') {
                return false
            }
            return true
        },

        isRegisterPage() {
            return this.$route.name === 'Register'
        },
        appVersion() {
            return import.meta.env.VITE_APP_VERSION
        },
        isConnected() {
            return this.$store.getters['users/isConnected']
        },
        showOnboardingScreen() {
            return this.$store.getters['organizations/current']?.onboarding_enabled
        },
    },
}
</script>

<style lang="scss" scoped>
footer {
    color: $dark;

    .footer-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: pxToRem(42px) auto;
    }

    .footer-lists {
        display: grid;
        flex-wrap: wrap;
        align-items: center;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media screen and (min-width: $min-tablet) {
            grid-template-columns: 1fr 1fr;
        }

        @media screen and (min-width: $min-desktop) {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
    }

    .footer-links {
        font-size: $font-size-m;
        font-weight: 400;
        flex-basis: 100%;

        li {
            cursor: pointer;
            margin: $space-m auto;
        }

        a:hover {
            text-decoration: underline;
        }
    }

    .creators {
        display: flex;
        align-items: center;
        font-size: $font-size-s;

        > div {
            margin-right: $space-m;
            text-align: right;
        }
    }

    .lpi-logo {
        width: pxToRem(95px);
        height: pxToRem(87px);
    }

    .projects {
        font-weight: 700;
        font-size: $font-size-s;
    }

    .report-form {
        position: absolute; // get out of my flex !
    }

    .directory-ctn {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        background-color: $gray-9;
        padding: 1rem 0;
        justify-content: center;

        .logo {
            margin-left: $space-m;
            height: pxToRem(40px);
            background-color: $white;
            border-radius: $border-radius-8;
        }

        .no-logo {
            height: pxToRem(40px);
        }

        .link {
            color: $primary-dark;
            font-weight: bold;
        }
    }
}

@media screen and (width <= 768px) {
    footer {
        flex-direction: column;
        align-items: start;

        .directory-ctn {
            justify-content: center;

            .content {
                padding: $space-m;
            }
        }

        .logo {
            margin-left: unset;
        }

        .link {
            margin-bottom: $space-m;
        }

        ul {
            margin-bottom: $space-m;
        }
    }
}
</style>
