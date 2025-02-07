<template>
    <div id="APP" :class="[/*themeclass,*/ currentRouteName, { 'has-open-drawer': isLoading }]">
        <LpiHeader />

        <div id="scrollview" ref="scrollview" data-test="scrollview">
            <div class="main-view">
                <NuxtPage />
            </div>
            <LpiFooter @on-click="toggleReportBugModal" />
        </div>

        <AppToastList />
    </div>
</template>

<script>
import LpiFooter from '@/components/app/LpiFooter.vue'
import AppToastList from '@/components/app/AppToastList.vue'
import LpiHeader from '@/components/app/LpiHeader.vue'
import { checkExpiredToken } from '@/api/auth/keycloakUtils.ts'
import useUsersStore from '@/stores/useUsers.ts'
import useKeycloak from '@/api/auth/keycloak.ts'

export default {
    name: 'App',

    components: {
        LpiHeader,
        LpiFooter,
        AppToastList,
    },

    data() {
        return {
            reportBugModalActive: false,
            isLoading: false,
        }
    },

    computed: {
        usersStoreToken() {
            return this.usersStore.accessToken
        },

        currentRouteName() {
            // Fix buefy class overwrite css since we renamed concepts->tags
            if (this.$route.name === 'tags') return ''

            return this.$route.name
        },
    },
    setup() {
        const usersStore = useUsersStore()
        const keycloak = useKeycloak()
        return {
            usersStore,
            keycloak,
        }
    },

    mounted() {
        if (window.socket.connected) {
            socket.disconnect()
        }

        // handle multiple tabs browsing for auth
        window.addEventListener('focus', this.onFocus)

        document.querySelector('.app-loader')?.classList.add('fade-out')
        setTimeout(() => {
            document.querySelector('.app-loader')?.remove()
        }, 200)
    },

    beforeUnmount() {
        // this.$refs.scrollview.removeEventListener('scroll', this.setDarkTopbar)
        window.removeEventListener('focus', this.onFocus)
    },

    methods: {
        toggleReportBugModal() {
            this.reportBugModalActive = !this.reportBugModalActive
        },

        onFocus() {
            const accessToken = localStorage.getItem('ACCESS_TOKEN')

            const _logout = () => {
                this.usersStore.resetUser()
                // navigate to /dashboard
                if (!this.$route || this.$route.name !== 'Home') {
                    this.$router.push({ name: 'Home' })
                }
            }
            if (this.usersStoreToken && accessToken) {
                // logged in, verify token is still fresh
                if (checkExpiredToken()) {
                    _logout()
                }
            } else if (this.usersStoreToken && !accessToken) {
                // logged out in another tab
                _logout()
            } else if (!this.usersStoreToken && accessToken) {
                // logged in in another tab
                this.keycloak.refreshTokenLoop.start()
            }
        },
    },
}
</script>
<style lang="scss">
@import '@/design/scss/main';

#APP {
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
    justify-content: stretch;

    #scrollview {
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: stretch;

        .main-view {
            flex-grow: 1;
        }

        #footer {
            flex-shrink: 0;
        }
    }
}

#APP.notification {
    padding: 0; // overwrite buefy ".notification" style
}
</style>
