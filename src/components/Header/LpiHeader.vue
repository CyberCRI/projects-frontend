<template>
    <div :class="{ scrolled }" class="header">
        <header class="header__container page-section-full">
            <div :class="{ 'header__arrows--nav-open': isNavOpen }" class="header__directory">
                <router-link to="/" data-test="lpi-logo">
                    <img
                        v-if="organisation && organisation.logo_image.variations"
                        :src="organisation.logo_image.variations.medium"
                        alt=""
                        class="header__logo"
                    />
                </router-link>
            </div>

            <div class="header__group-buttons">
                <HeaderLink
                    :label="$t('search.search-title')"
                    :routes="[
                        'Search',
                        'GlobalSearch',
                        'ProjectSearch',
                        'PeopleSearch',
                        'GroupSearch',
                    ]"
                    :to="{ name: 'Search' }"
                />
                <!--TODO: put this back once the new page is created-->
                <!--                <HeaderLink :label="$t('search.peoples')" route="people" :to="{name: 'People'}" />-->
                <HeaderLink
                    v-if="$store.getters['projectCategories/all'].length"
                    :label="$t('projects')"
                    :routes="[
                        'Categories',
                        'Category',
                        'pageProject',
                        'projectSummary',
                        'projectDescription',
                        'projectBlog',
                        'projectGoals',
                        'projectTeam',
                        'projectResources',
                        'projectLinkedProjects',
                        'projectComments',
                        'projectAnnouncements',
                        'ProjectSettings',
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
                        'ProfileOtherUser',
                        'ProfileEditOtherUser',
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
                <HeaderLink v-if="isConnected" @click="getNotifications">
                    <NotificationIcon :notification-count="notificationCount" />
                </HeaderLink>
                <HeaderLink
                    v-if="!isConnected"
                    :label="$t('common.login')"
                    :rounded-icon="true"
                    icon="Account"
                    @click="logInUser()"
                    data-test="test-login-button"
                />
                <HeaderDropDown
                    v-else-if="isOrgAdmin || isFacilitator || isSuperAdmin"
                    :label="loginName"
                    :menu-items="userMenu"
                    :rounded-icon="true"
                    data-test="dropdown-user-account"
                >
                    <template #badge>
                        <BadgeItem :label="AdminLabel" class="user-badge"></BadgeItem>
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
                    :label="$store.getters['languages/current'].toUpperCase()"
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
                    <h2 class="title">{{ $t('header.mobile-menu-title') }}</h2>

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

        <DrawerLayout
            :custom-style="customNotificationStyle"
            :has-footer="false"
            :is-opened="showNotificationDrawer"
            class="small"
            confirm-action-name=""
            title="Notifications"
            @close="closeDrawer"
        >
            <NotificationList
                v-if="showNotificationDrawer"
                :is-loading="isLoading"
                :notifications="filteredNotifications"
                @go-to="notificationAction"
            />
        </DrawerLayout>

        <DrawerLayout
            :custom-style="customNotificationStyle"
            :is-opened="showContactUsDrawer"
            :has-footer="false"
            class="medium"
            confirm-action-name=""
            :title="$t('footer.contact')"
            @close="closeDrawer"
        >
            <ContactForm v-if="showContactUsDrawer" @close="closeDrawer" />
        </DrawerLayout>
    </div>
</template>

<script>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// EASTER BUG 9 bis : lang is not saved
// import { patchUser } from '@/api/people.service.ts'
import { getAnnouncements } from '@/api/announcements.service'

import permissions from '@/mixins/permissions.ts'

import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import HeaderLink from '@/components/Header/HeaderLink.vue'
import HeaderDropDown from '@/components/Header/HeaderDropDown.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import NotificationIcon from '@/components/lpikit/NotificationIcon/NotificationIcon.vue'
import NotificationList from '@/components/lpikit/Notifications/NotificationList.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import HeaderItemList from '@/components/Header/HeaderItemList.vue'
import ContactForm from '@/components/Drawers/ContactForm.vue'

export default {
    name: 'LpiHeader',

    mixins: [permissions],

    components: {
        ContactForm,
        HeaderItemList,
        BadgeItem,
        NotificationList,
        LinkButton,
        HeaderLink,
        HeaderDropDown,
        NotificationIcon,
        DrawerLayout,
        IconImage,
    },

    data() {
        return {
            isNavOpen: false,
            categoriesModalActive: false,
            openPortalNav: false,
            faqModalActive: false,
            isLoading: true,
            showNotificationDrawer: false,
            showContactUsDrawer: false,
            customNotificationStyle: {
                maxHeight: 'unset',
                padding: 'unset',
            },
            scrolled: false,
            announcements: [],
        }
    },

    async mounted() {
        await this.$store.dispatch('projectCategories/getAllProjectCategories')
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
            await this.$store.dispatch('users/logOut')
        },

        closeNav() {
            this.isNavOpen = false
        },

        toggleNav() {
            this.isNavOpen = !this.isNavOpen
        },

        async getNotifications() {
            this.showNotificationDrawer = !this.showNotificationDrawer
            await this.$store.dispatch('notifications/getNotifications')
            this.$store.commit('users/SET_NOTIFICATIONS_COUNT', 0)
            this.isLoading = false
        },

        closeDrawer() {
            this.showNotificationDrawer = false
            this.showContactUsDrawer = false
        },

        notificationAction(notification) {
            this.showNotificationDrawer = !this.showNotificationDrawer
            if (
                notification.type === 'invitation_week_reminder' ||
                notification.type === 'invitation_today_reminder'
            ) {
                return
            } else if (
                notification.type === 'access_request' ||
                notification.type === 'pending_access_requests'
            ) {
                this.$router.push({ name: 'RequestsAdminTab' })
            } else {
                this.$router.push({
                    name: 'projectSummary',
                    params: { slugOrId: notification.project.slug },
                })
            }
        },

        async updateLanguage(lang) {
            if (this.isConnected) {
                const body = {
                    language: lang,
                }
                // dont wait for termination, user update take a while
                // and we dont want the UI to freeze meanwhile
                // EASTER BUG 9 : lang is not saved
                //patchUser(this.$store.getters['users/id'], body)
            }

            await this.$store.dispatch('languages/updateCurrentLanguage', lang)
        },

        async toAnnouncements() {
            /* TODO: Rework this once we have skeletons on all components */
            await this.$router.push({ name: 'Home' })

            setTimeout(() => {
                const el = document.getElementById('announcements')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 500)
        },

        async getGlobalAnnouncements() {
            try {
                const announcements = await getAnnouncements({
                    organizations: [this.organization.code],
                    ordering: '-updated_at',
                })
                this.announcements = announcements.results.filter(
                    (announcement) =>
                        (announcement.project.publication_status !== 'private' &&
                            !announcement.deadline) ||
                        new Date(announcement.deadline) >= new Date().setHours(0, 0, 0, 0)
                )
            } catch (err) {
                console.error(err)
            }
        },
    },

    computed: {
        isConnected() {
            return this.$store.getters['users/isConnected']
        },

        langMenu() {
            return this.$store.getters['languages/all']
                .map((lang) => ({
                    label: lang.toUpperCase(),
                    action: () => this.updateLanguage(lang),
                }))
                .filter(
                    (lang) => lang.label !== this.$store.getters['languages/current'].toUpperCase()
                )
        },

        organization() {
            return this.$store.getters['organizations/current']
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
            const moreExtras = new Map()
            moreExtras.set('old', [
                {
                    label: this.$t('home.announcements').toUpperCase(),
                    action: () => this.toAnnouncements(),
                    leftIcon: 'BullhornOutline',
                    condition: this.announcements.length > 0,
                    dataTest: 'announcements',
                },
            ])

            moreExtras.set('new', [
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
            ])

            return [
                ...(moreExtras.get(import.meta.env.VITE_APP_HOME) || moreExtras.get('old') || []),
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
                    condition: this.$store.getters['projectCategories/all'].length,
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
                    action: () => this.getNotifications(),
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
                    label: this.$store.getters['languages/current'].toUpperCase(),
                    childItems: this.langMenu,
                    condition: true,
                    dataTest: 'lang',
                },
            ].filter((item) => item.condition)
        },

        loginName() {
            if (!this.isConnected) return ''
            return this.$store.getters['users/user'].name.firstname.toUpperCase()
        },

        AdminLabel() {
            if (this.isSuperAdmin) return 'super admin'
            if (this.isOrgAdmin) return 'org admin'
            if (this.isFacilitator) return 'facilitator'
            return ''
        },

        filteredNotifications() {
            return this.notifications.map((notification) => ({
                ...notification,
                icon: !notification.is_viewed ? 'Circle' : null,
                action: () => this.notificationAction(notification),
            }))
        },

        notificationCount() {
            return this.$store.getters['users/getNotificationCount']
        },

        notifications() {
            return this.$store.getters['notifications/notifications']
        },

        organisation() {
            return this.$store.getters['organizations/current']
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

    &__directory {
        display: flex;
    }

    &__container {
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

    &__group-buttons-mobile {
        display: flex;
    }

    &__group-buttons {
        display: none;
    }

    .user-badge {
        margin-right: $space-s;
        font-weight: 700;
        font-size: $font-size-xs;
        line-height: 15px;
    }

    &__mobile-nav {
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
                line-height: 28px;
                padding-top: calc($navbar-height + $space-m);
                margin-left: 8px;
            }
        }

        .close-icon {
            position: absolute;
            z-index: 10;
            right: 1rem;
            top: 1rem;
            width: $font-size-2xl;
            height: $font-size-2xl;
            fill: $white;
            cursor: pointer;
        }
    }

    &__link {
        color: $white;
        text-transform: uppercase;
        cursor: pointer;

        &:visited {
            color: $white;
        }
    }

    &__list-item {
        padding: $space-xs 0;
        text-align: start;
        font-weight: 700;
        font-size: $font-size-m;
        line-height: 18px;

        &:first-child {
            padding-top: pxToRem(40px);
        }
    }

    &__logo {
        height: pxToRem(25px);
    }

    &__arrows {
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

        &__group-buttons {
            display: flex;
        }

        &__group-buttons-mobile {
            display: none;
        }

        &__mobile-btn {
            display: none !important;
        }

        &__mobile-nav {
            display: none;
        }

        &__button {
            text-transform: uppercase;
            margin-top: $space-2xs;
        }

        &__logo {
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
