<template>
  <div :class="{ scrolled }" class="header">
    <header class="header__container page-section-full">
      <div :class="{ 'header__arrows--nav-open': isNavOpen }" class="header__directory">
        <NuxtLink to="/" data-test="lpi-logo">
          <img
            :src="organisation?.logo_image?.variations?.medium || ''"
            alt=""
            class="header__logo"
          />
        </NuxtLink>
      </div>

      <div class="header__group-buttons">
        <HeaderLink
          :label="$t('search.search-title')"
          :routes="['Search', 'GlobalSearch', 'ProjectSearch', 'PeopleSearch', 'GroupSearch']"
          :to="{ name: 'Search' }"
        />
        <!--TODO: put this back once the new page is created-->
        <!--                <HeaderLink :label="$t('search.peoples')" route="people" :to="{name: 'People'}" />-->
        <HeaderLink
          v-if="projectCategoriesStore.all?.length"
          :label="$t('projects')"
          :routes="[
            'Categories',
            'Category',
            'pageProject',
            'projectSummary',
            'projectDescription',
            'ProjectLocations',
            'projectBlog',
            'projectGoals',
            'projectTeam',
            'projectResources',
            'projectLinkedProjects',
            'projectComments',
            'projectPrivateExchange',
            'projectAnnouncements',
            'ProjectSettings',
            'projectSummaryEdit',
            'projectDescriptionEdit',
            'ProjectLocationsEdit',
            'projectBlogEdit',
            'projectGoalsEdit',
            'projectTeamEdit',
            'projectResourcesEdit',
            'projectLinkedProjectsEdit',
            'projectCommentsEdit',
            'projectPrivateExchangeEdit',
            'projectAnnouncementsEdit',
            'ProjectSettingsEdit',
          ]"
          :to="{ name: 'Categories' }"
        />
        <HeaderLink
          :label="$t('common.people')"
          :routes="[
            'People',
            'Profile',
            'ProfileSummary',
            'ProfileBio',
            'ProfileProjects',
            'ProfileGroups',
            'ProfileSkills',
            'ProfileEdit',
            'ProfileEditOther',
            'ProfileOtherUser',
            'ProfileEditOtherUser',
            'ProfileSummaryOther',
            'ProfileBioOther',
            'ProfileProjectsOther',
            'ProfileGroupsOther',
            'ProfileSkillsOther',
            'ProfileEditGeneralOther',
            'ProfileEditBioOther',
            'ProfileEditProjectsOther',
            'ProfileEditGroupsOther',
            'ProfileEditSkillsOther',
          ]"
          :to="{ name: 'People' }"
        />
        <HeaderLink
          :label="$t('common.groups')"
          :routes="[
            'Groups',
            'Group',
            'groupSnapshot',
            'groupMembers',
            'groupProjects',
            'frontEditGroup',
          ]"
          :to="{ name: 'Groups' }"
        />
        <HeaderDropDown
          :label="$t('common.more')"
          :menu-items="moreMenu"
          :rounded-icon="true"
          data-test="dropdown-plus"
        />
        <HeaderLink v-if="isConnected" @click="showNotificationDrawer = true">
          <NotificationIcon :notification-count="notificationCount" />
        </HeaderLink>
        <HeaderLink
          v-if="!isConnected"
          :label="$t('common.login')"
          :rounded-icon="true"
          icon="Account"
          data-test="test-login-button"
          @click="logInUser()"
        />
        <HeaderDropDown
          v-else-if="isOrgAdmin || isFacilitator || isSuperAdmin"
          :label="loginName"
          :menu-items="userMenu"
          :rounded-icon="true"
          data-test="dropdown-user-account"
        >
          <template #badge>
            <BadgeItem :label="AdminLabel" class="user-badge" />
          </template>
        </HeaderDropDown>
        <HeaderDropDown
          v-else
          :label="loginName"
          :menu-items="userMenu"
          :rounded-icon="true"
          data-test="dropdown-user-account"
          icon="Account"
        />
        <HeaderDropDown
          v-if="organizationsStore?.languages?.length > 1"
          :label="locale.toUpperCase()"
          :menu-items="langMenu"
          data-test="dropdown-lang"
        />
      </div>
      <div class="header__group-buttons-mobile">
        <LinkButton
          v-if="!isConnected"
          :class="{ 'header__close-icon': isNavOpen }"
          :label="$filters.capitalize($t('common.login'))"
          class="header__mobile-btn"
          data-test="login-button"
          @click="login"
        />

        <LinkButton
          :class="{ 'header__open-icon': !isNavOpen, 'header__close-icon': isNavOpen }"
          :data-test="isNavOpen ? 'close-menu-button' : 'open-menu-button'"
          :btn-icon="isNavOpen ? 'Close' : 'BarsStaggered'"
          class="header__mobile-btn"
          @click="toggleNav"
        />
      </div>
    </header>

    <Transition name="slide-fade">
      <aside v-show="isNavOpen" class="header__mobile-nav">
        <IconImage class="close-icon" name="Close" @click="isNavOpen = false" />
        <nav class="nav-container">
          <h2 class="title">
            {{ $t('header.mobile-menu-title') }}
          </h2>

          <ul>
            <HeaderItemList
              v-for="(item, index) in mobileMenu"
              :key="index"
              :item="item"
              class="header__list-item"
              @close="closeNav"
            />
          </ul>
        </nav>
      </aside>
    </Transition>

    <NotificationList :is-opened="showNotificationDrawer" @close="closeDrawer" />

    <ContactDrawer :is-opened="showContactUsDrawer" @close="closeDrawer" />
  </div>
</template>

<script>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import { patchUser } from '@/api/people.service.ts'
import { getAnnouncements } from '@/api/announcements.service'

import LinkButton from '@/components/base/button/LinkButton.vue'
import HeaderLink from '@/components/base/navigation/HeaderLink.vue'
import HeaderDropDown from '@/components/base/navigation/HeaderDropDown.vue'
import NotificationIcon from '@/components/app/NotificationIcon.vue'
import NotificationList from '@/components/app/NotificationList.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import HeaderItemList from '@/components/base/navigation/HeaderItemList.vue'
import ContactDrawer from '@/components/app/ContactDrawer.vue'
import useProjectCategories from '@/stores/useProjectCategories.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
export default {
  name: 'LpiHeader',

  components: {
    ContactDrawer,
    HeaderItemList,
    BadgeItem,
    NotificationList,
    LinkButton,
    HeaderLink,
    HeaderDropDown,
    NotificationIcon,
    IconImage,
  },

  setup() {
    const projectCategoriesStore = useProjectCategories()
    const organizationsStore = useOrganizationsStore()
    const usersStore = useUsersStore()
    const { isAdmin, isFacilitator, isSuperAdmin, isOrgAdmin } = usePermissions()
    const { locale, setLocale } = useI18n()
    const { isAutoTranslateActivated } = useAutoTranslate()
    return {
      projectCategoriesStore,
      organizationsStore,
      usersStore,
      isAdmin,
      isFacilitator,
      isSuperAdmin,
      isOrgAdmin,
      locale,
      isAutoTranslateActivated,
      setLocale,
    }
  },

  data() {
    return {
      isNavOpen: false,
      categoriesModalActive: false,
      openPortalNav: false,
      faqModalActive: false,
      showNotificationDrawer: false,
      showContactUsDrawer: false,
      scrolled: false,
      announcements: [],
    }
  },

  computed: {
    isConnected() {
      return this.usersStore.isConnected
    },

    langMenu() {
      const menu = this.organizationsStore.languages
        .map((lang) => ({
          label: `${lang.toUpperCase()} - ${this.$t('language.label-' + lang)}`,
          action: () => this.updateLanguage(lang),
        }))
        .filter((lang) => lang.label !== this.locale.toUpperCase())
      menu.push({
        label: this.isAutoTranslateActivated
          ? this.$t('language.auto-translate-on')
          : this.$t('language.auto-translate-on'),
        action: () => {
          this.isAutoTranslateActivated = !this.isAutoTranslateActivated
        },
        leftIcon: this.isAutoTranslateActivated ? 'CheckBoxChecked' : 'SquareRoundedOutline',
      })

      return menu
    },

    organization() {
      return this.organizationsStore.current
    },

    showDocumentsLink() {
      // admin should always access to documents, so they can add the first one...
      return this.isAdmin || (this.isConnected && this.organization?.attachment_files_count > 0)
    },

    userMenu() {
      return [
        {
          label: this.$t('me.page-title').toUpperCase(),
          to: { name: 'ProfileSummary' },
          leftIcon: 'Account',
          condition: true,
          dataTest: 'my-profile',
        },
        {
          label: this.$t('me.my-projects').toUpperCase(),
          to: { name: 'ProfileProjects' },
          leftIcon: 'Briefcase',
          condition: this.isConnected,
          dataTest: 'my-projects',
        },
        {
          label: this.$t('notifications.header').toUpperCase(),
          to: { name: 'settings' },
          leftIcon: 'Cog',
          condition: this.isConnected,
          dataTest: 'notifications',
        },
        {
          label: this.$t('stats.page-title').toUpperCase(),
          to: {
            name: 'stats',
          },
          leftIcon: 'Poll',
          condition: this.isAdmin,
          dataTest: 'stats',
        },
        {
          label: this.$t('admin.page-title').toUpperCase(),
          to: { name: 'Admin' },
          leftIcon: 'Tune',
          condition: this.isAdmin,
          dataTest: 'admin',
        },
        {
          label: this.$t('common.disconnect').toUpperCase(),
          action: () => this.logOutUser(),
          leftIcon: 'Logout',
          condition: true,
          dataTest: 'disconnect',
        },
      ].filter((menu) => menu.condition)
    },

    moreMenu() {
      return [
        {
          label: this.$t('home.documents').toUpperCase(),
          to: { name: 'DocumentsPage' },
          leftIcon: 'File',
          condition: this.showDocumentsLink, // TODO: check also if there's any document or if we are admin
          dataTest: 'more-documents',
        },
        {
          label: this.$t('home.calendar').toUpperCase(),
          to: { name: 'CalendarPage' },
          leftIcon: 'Calendar',
          condition: true, // TODO ?
          dataTest: 'more-calendar',
        },
        {
          label: this.$t('home.instructions').toUpperCase(),
          to: { name: 'InstructionListPage' },
          leftIcon: 'BookmarkBoxOutline',
          condition: true, // TODO ?
          dataTest: 'more-instructions',
        },
        {
          label: this.$t('home.news').toUpperCase(),
          to: { name: 'NewsListPage' },
          leftIcon: 'Article',
          condition: true, // TODO ?
          dataTest: 'more-instructions',
        },
        {
          label: this.$t('home.announcements').toUpperCase(),
          to: { name: 'AnnouncementsPage' },
          leftIcon: 'BullhornOutline',
          condition: this.announcements.length > 0,
          dataTest: 'announcements',
        },
        {
          label: this.$t('home.our-locations').toUpperCase(),
          to: { name: 'map' },
          leftIcon: 'Map',
          condition: true,
          dataTest: 'map',
        },
        {
          label: this.$t('home.communities').toUpperCase(),
          to: { name: 'Portal' },
          leftIcon: 'Globe',
          condition: true,
          dataTest: 'portals',
        },
        {
          label: this.$t('faq.portal').toUpperCase(),
          to: { name: 'Help' },
          leftIcon: 'Lifebuoy',
          condition: true,
          dataTest: 'help',
        },
        {
          label: this.$t('footer.contact').toUpperCase(),
          action: () => (this.showContactUsDrawer = true),
          leftIcon: 'EmailOutline',
          condition: true,
          dataTest: 'contact-us',
        },
      ].filter((menu) => menu.condition)
    },

    mobileMenu() {
      return [
        {
          label: this.$t('search.search-title'),
          action: () => this.goTo('Search'),
          leftIcon: null,
          condition: true,
          dataTest: 'search',
        },
        {
          label: this.$t('projects'),
          action: () => this.goTo('Categories'),
          leftIcon: null,
          condition: this.projectCategoriesStore.all?.length,
          dataTest: 'search',
        },
        {
          label: this.$t('common.people'),
          action: () => this.goTo('People'),
          leftIcon: null,
          condition: true,
          dataTest: 'people',
        },
        {
          label: this.$t('common.groups'),
          action: () => this.goTo('Groups'),
          leftIcon: null,
          condition: true,
          dataTest: 'people',
        },
        {
          label: this.$t('common.more'),
          childItems: this.moreMenu,
          condition: true,
          dataTest: 'more',
        },
        {
          label: this.$t('notifications.header'),
          action: () => {
            this.showNotificationDrawer = true
          },
          leftIcon: 'Bell',
          condition: this.isConnected,
          dataTest: 'notifications',
        },
        {
          label: this.loginName,
          childItems: this.userMenu,
          condition: this.isConnected && !(this.isAdmin || this.isFacilitator),
          dataTest: 'user-dropdown-menu',
        },
        {
          label: this.loginName,
          childItems: this.userMenu,
          badge: this.AdminLabel,
          condition: this.isConnected && (this.isAdmin || this.isFacilitator),
          dataTest: 'user-dropdown-menu',
        },
        {
          label: this.locale.toUpperCase(),
          childItems: this.langMenu,
          condition: true,
          dataTest: 'lang',
        },
      ].filter((item) => item.condition)
    },

    loginName() {
      if (!this.isConnected) return ''
      return this.usersStore.user.name.firstname.toUpperCase()
    },

    AdminLabel() {
      if (this.isSuperAdmin) return 'super admin'
      if (this.isOrgAdmin) return 'org admin'
      if (this.isFacilitator) return 'facilitator'
      return ''
    },

    notificationCount() {
      return this.usersStore.notificationsCount
    },
    organisation() {
      return this.organizationsStore.current
    },

    langFromUser() {
      return this.usersStore.userFromApi?.language
    },
  },

  watch: {
    langFromUser: {
      handler: function (neo, old) {
        if (neo && neo != old && neo != this.locale) {
          this.setLocale(neo)
        }
      },
      immediate: true,
    },
  },

  async mounted() {
    await this.projectCategoriesStore.getAllProjectCategories()
    document.addEventListener('scroll', this.onScroll)

    await this.getGlobalAnnouncements()
  },

  unmounted() {
    document.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    onScroll() {
      this.scrolled = window.scrollY > 10
    },

    login() {
      goToKeycloakLoginPage()
    },

    goTo(route, params = null, query = null) {
      this.$router.push({
        name: route,
        params: params || {},
        query: query || {},
      })
    },

    logInUser() {
      goToKeycloakLoginPage()
    },

    async logOutUser() {
      await this.usersStore.logOut()
    },

    closeNav() {
      this.isNavOpen = false
    },

    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },

    closeDrawer() {
      this.showNotificationDrawer = false
      this.showContactUsDrawer = false
    },

    updateLanguage(lang) {
      if (this.isConnected) {
        const body = {
          language: lang,
        }
        // dont wait for termination, user update take a while
        // and we dont want the UI to freeze meanwhile
        patchUser(this.usersStore.id, body)
      }

      this.setLocale(lang)
    },

    async getGlobalAnnouncements() {
      try {
        const announcements = await getAnnouncements({
          organizations: [this.organization.code],
          ordering: '-updated_at',
        })
        this.announcements =
          announcements.results?.filter(
            (announcement) =>
              (announcement.project.publication_status !== 'private' && !announcement.deadline) ||
              new Date(announcement.deadline) >= new Date().setHours(0, 0, 0, 0)
          ) || []
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100%;
  height: $navbar-height;
  top: 0;
  left: 0;
  background-color: $white;
  display: flex;
  z-index: $zindex-navbar;

  .header__directory {
    display: flex;
  }

  .header__container {
    padding-top: $space-m;
    padding-bottom: $space-m;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    transition: box-shadow 200ms;
    box-shadow: 0 0 rgb(190 190 190 / 50%);
  }

  &.scrolled &__container {
    box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
  }

  .header__group-buttons-mobile {
    display: flex;
  }

  .header__group-buttons {
    display: none;
  }

  .user-badge {
    margin-right: $space-s;
    font-weight: 700;
    font-size: $font-size-xs;
  }

  .header__mobile-nav {
    height: 100vh;
    width: 98%;
    background: $primary-dark;
    position: absolute;
    right: 0;
    padding: 0;
    border-top-left-radius: $border-radius-l;
    border-bottom-left-radius: $border-radius-l;
    overflow-x: scroll;

    .nav-container {
      text-transform: uppercase;
      color: $white;
      margin-left: $space-2xl;
      margin-right: $space-2xl;

      .title {
        font-weight: 700;
        font-size: $font-size-2xl;
        padding-top: calc($navbar-height + $space-m);
        margin-left: 8px;
      }
    }

    .close-icon {
      position: absolute;
      z-index: 10;
      right: 1rem;
      top: 1rem;
      width: $layout-size-2xl;
      height: $layout-size-2xl;
      fill: $white;
      cursor: pointer;
    }
  }

  .header__link {
    color: $white;
    text-transform: uppercase;
    cursor: pointer;

    &:visited {
      color: $white;
    }
  }

  .header__list-item {
    padding: $space-xs 0;
    text-align: start;
    font-weight: 700;
    font-size: $font-size-m;

    &:first-child {
      padding-top: pxToRem(40px);
    }
  }

  .header__logo {
    height: pxToRem(25px);
  }

  .header__arrows {
    width: pxToRem(42px);
    fill: $primary-dark;

    &--nav-open {
      svg {
        fill: $white !important;
      }
    }
  }
}

.lang-switch .current {
  color: $white;
  text-transform: uppercase;
  text-decoration: underline;
  margin-right: $space-m;
  display: inline-block;
}

.header__arrows--nav-open,
.header__close-icon {
  svg {
    fill: $white !important;
  }
}

.slide-fade-leave-active,
.slide-fade-enter-active {
  transition: 400ms;
}

.slide-fade-enter-from {
  transform: translateX(100%);
}

.slide-fade-leave-to {
  transform: translateX(100%);
}

a:visited {
  color: $white;
}

@media (min-width: pxToRem(1120px)) {
  .header {
    position: fixed;

    .header__group-buttons {
      display: flex;
    }

    .header__group-buttons-mobile {
      display: none;
    }

    .header__mobile-btn {
      display: none !important;
    }

    .header__mobile-nav {
      display: none;
    }

    .header__button {
      text-transform: uppercase;
      margin-top: $space-2xs;
    }

    .header__logo {
      height: pxToRem(40px);
    }
  }

  .header__arrows--nav-open,
  .header__close-icon {
    svg {
      fill: $white !important;
    }
  }
}
</style>
