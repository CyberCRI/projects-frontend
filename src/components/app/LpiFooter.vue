<template>
  <footer id="footer" class="page-section-full">
    <div v-if="!isRegisterPage && showDirectoryLink" class="directory-ctn">
      <p v-if="showDirectoryLink" class="content">
        {{ $t('footer.directory') }}
        <a class="link" href="https://projects.directory" target="_blank"
          >https://projects.directory</a
        >
      </p>

      <ProjectLogo v-if="showDirectoryLink" class="logo" />
      <div v-else class="no-logo" />
    </div>
    <div class="footer-content">
      <div class="footer-lists">
        <ul class="footer-links">
          <li v-if="canOpen" class="list-item">
            <NuxtLink to="/legal-notices">
              {{ $t('footer.legal-notices') }}
            </NuxtLink>
          </li>
          <li v-else>
            <FooterEnglishTips ref="copy-link-tooltip" item-title="legal notices">
              <NuxtLink to="/legal-notices">
                {{ $t('footer.legal-notices') }}
              </NuxtLink>
            </FooterEnglishTips>
          </li>

          <li v-if="canOpen" class="list-item">
            <NuxtLink to="/personal-data">
              {{ $t('footer.personal-data') }}
            </NuxtLink>
          </li>
          <li v-else>
            <FooterEnglishTips ref="copy-link-tooltip" item-title="protection policy">
              <NuxtLink to="/personal-data">
                {{ $t('footer.personal-data') }}
              </NuxtLink>
            </FooterEnglishTips>
          </li>
          <li class="list-item">
            <a
              class="source-link"
              href="https://github.com/CyberCRI/projects-frontend"
              target="_blank"
            >
              <span>
                {{ $t('footer.sourceText') }}
              </span>
              <img
                :src="`${runtimeConfig.public.appPublicBinariesPrefix}/source.png`"
                alt="CC BY-NC-SA 4.0"
              />
            </a>
          </li>
        </ul>

        <ul class="footer-links">
          <li v-if="canOpen" class="list-item">
            <NuxtLink to="/terms-of-service">
              {{ $t('footer.terms-of-service') }}
            </NuxtLink>
          </li>
          <li v-else>
            <FooterEnglishTips ref="copy-link-tooltip" item-title="terms of use">
              <NuxtLink to="/terms-of-service">
                {{ $t('footer.terms-of-service') }}
              </NuxtLink>
            </FooterEnglishTips>
          </li>

          <li v-if="canOpen" class="list-item">
            <NuxtLink to="/cookies">
              {{ $t('footer.cookies') }}
            </NuxtLink>
          </li>
          <li v-else>
            <FooterEnglishTips ref="copy-link-tooltip" item-title="cookies">
              <NuxtLink to="/cookies">
                {{ $t('footer.cookies') }}
              </NuxtLink>
            </FooterEnglishTips>
          </li>
        </ul>

        <ul class="footer-links">
          <li v-if="canOpen" class="list-item">
            <NuxtLink to="/accessibility">
              {{ $t('footer.accessibility') }}
            </NuxtLink>
          </li>
          <li v-else>
            <FooterEnglishTips ref="copy-link-tooltip" item-title="accessibility">
              <NuxtLink to="/accessibility">
                {{ $t('footer.accessibility') }}
              </NuxtLink>
            </FooterEnglishTips>
          </li>

          <li class="list-item">
            <NuxtLink to="/help">
              {{ $t('footer.help') }}
            </NuxtLink>
          </li>
        </ul>
        <ul class="footer-links">
          <li class="list-item">
            <a @click.prevent="reportBugOpen = true">{{ $t('report.bug') }}</a>
          </li>
          <li class="list-item">
            <a href="#" @click.prevent="showContactUsDrawer = true">{{ $t('footer.contact') }}</a>
          </li>
        </ul>
      </div>

      <div class="creators">
        <div>
          <p class="projects">
            {{ $t('footer.projects') }}
          </p>
          <p v-if="appVersion">
            {{ appVersion }}
          </p>
          <p>{{ $t('footer.madeBy') }}</p>
        </div>

        <LpiLogo class="lpi-logo" />
      </div>
    </div>

    <ContactDrawer :is-opened="showContactUsDrawer" @close="showContactUsDrawer = false" />

    <ReportDrawer :is-opened="reportBugOpen" type="bug" @close="reportBugOpen = false" />

    <OnboardingScreens v-if="showOnboardingScreen && isConnected" />
  </footer>
</template>

<script>
import LpiLogo from '@/components/app/LpiLogo.vue'
import ReportDrawer from '@/components/app/ReportDrawer.vue'
import ContactDrawer from '@/components/app/ContactDrawer.vue'
import ProjectLogo from '@/components/base/media/ProjectLogo.vue'
import FooterEnglishTips from '@/components/app/FooterEnglishTips.vue'
import OnboardingScreens from '@/components/onboarding/OnboardingScreens/OnboardingScreens.vue'
import useLanguagesStore from '@/stores/useLanguages'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
import { useRuntimeConfig } from '#imports'

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
  setup() {
    const languagesStore = useLanguagesStore()
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      languagesStore,
      organizationsStore,
      usersStore,
      runtimeConfig,
    }
  },
  data() {
    return {
      reportBugOpen: false,
      showContactUsDrawer: false,
    }
  },
  computed: {
    canOpen() {
      return this.languagesStore.current === 'fr'
    },
    showDirectoryLink() {
      const organization = this.organizationsStore.current
      if (organization && organization.code === 'DEFAULT') {
        return false
      }
      return true
    },

    isRegisterPage() {
      return this.$route.name === 'Register'
    },
    appVersion() {
      return this.runtimeConfig.public.appVersion
    },
    isConnected() {
      return this.usersStore.isConnected
    },
    showOnboardingScreen() {
      return this.organizationsStore.current?.onboarding_enabled
    },
  },
}
</script>

<style lang="scss" scoped>
footer {
  color: $almost-black;

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

      .source-link {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: $space-s;

        img {
          width: auto;
          height: $layout-size-2xl;
        }
      }
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

    .lpi-logo {
      width: pxToRem(95px);
      height: pxToRem(87px);
    }

    .projects {
      font-weight: 700;
      font-size: $font-size-s;
    }
  }

  .report-form {
    position: absolute; // get out of my flex !
  }

  .directory-ctn {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    background-color: $almost-white;
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
