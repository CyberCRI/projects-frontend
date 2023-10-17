<template>
    <div id="APP" :class="[themeclass, currentRouteName, { 'has-open-drawer': isLoading }]">
        <LpiHeader @is-loading="setLoading" />

        <div id="scrollview" ref="scrollview" data-test="scrollview">
            <div v-if="isLoading" class="global-loader">
                <LpiLoader class="loader" type="simple" />
            </div>
            <RouterView class="main-view" />
            <LpiFooter @on-click="toggleReportBugModal" />
        </div>

        <AppToastList :toast-list="toastList" @delete-toast="deleteToast($event)" />
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import debounce from 'lodash.debounce'

import LpiFooter from '@/components/lpikit/Footer/LpiFooter.vue'
import AppToastList from '@/components/App/AppToastList.vue'
import LpiHeader from '@/components/Header/LpiHeader.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { checkExpiredToken } from '@/api/auth/keycloakUtils.ts'

import keycloak from '@/api/auth/keycloak.ts'

export default {
    name: 'App',

    components: {
        LpiLoader,
        LpiHeader,
        LpiFooter,
        AppToastList,
    },

    data() {
        return {
            themeclass: false,
            modalErrorOpen: false,
            forcedark: false,
            reportBugModalActive: false,
            isLoading: false,
        }
    },

    computed: {
        ...mapGetters({
            toastList: 'notifications/getToastList',
            isLoggedIn: 'users/isLoggedIn',
            appLoading: 'app/loading',
        }),

        currentRouteName() {
            // Fix buefy class overwrite css since we renamed concepts->tags
            if (this.$route.name === 'tags') return ''

            return this.$route.name
        },
    },

    mounted() {
        this.forcedark = true

        if (this.theme !== 'main') {
            this.themeclass = this.theme
        }
        if (window.socket.connected) {
            socket.disconnect()
        }

        if (this.$route.name === 'Home') {
            this.setDarkTopbar = debounce(
                () => {
                    this.forcedark = this.$refs.scrollview.scrollTop > 300
                },
                150,
                { leading: false, trailing: true }
            )
            this.$refs.scrollview.addEventListener('scroll', this.setDarkTopbar)
            window.scrollTo(0, 0)
        }

        // handle multiple tabs browsing for auth
        window.addEventListener('focus', this.onFocus)

        this.$store.dispatch('faqs/getFaq', this.$store.getters['organizations/current'].code)
    },

    beforeUnmount() {
        this.$refs.scrollview.removeEventListener('scroll', this.setDarkTopbar)
        window.removeEventListener('focus', this.onFocus)
    },

    methods: {
        ...mapMutations({
            resetUser: 'users/RESET_USER',
            setUser: 'users/SET_USER',
        }),

        ...mapActions({
            deleteToast: 'notifications/deleteToast',
        }),

        toggleReportBugModal() {
            this.reportBugModalActive = !this.reportBugModalActive
        },

        onFocus() {
            const accessToken = localStorage.getItem('ACCESS_TOKEN')

            const _logout = () => {
                this.resetUser()
                // close all wins
                this.$store.dispatch('app/updateLoading', { visible: false })
                this.closeModal()
                // navigate to /dashboard
                if (!this.$route || this.$route.name !== 'Home') {
                    this.$router.push({ name: 'Home' })
                }
            }

            if (this.isLoggedIn && accessToken) {
                // logged in, verify token is still fresh
                if (checkExpiredToken()) {
                    _logout()
                }
            } else if (this.isLoggedIn && !accessToken) {
                // logged out in another tab
                _logout()
            } else if (!this.isLoggedIn && accessToken) {
                // logged in in another tab
                keycloak.refreshTokenLoop.start()
            }
        },

        closeModal() {
            this.modalErrorOpen = false
        },

        setLoading(value) {
            if (value) document.querySelector('body').classList.add('has-open-drawer')
            else document.querySelector('body').classList.remove('has-open-drawer')
            this.isLoading = value
        },
    },
}
</script>
<style lang="scss">
@import 'src/design/scss/main';

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

.global-loader {
    position: fixed;
    background-color: rgb(255 255 255 / 80%);
    width: 100%;
    height: 100%;
    z-index: 1;

    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}

#APP.notification {
    padding: 0; // overwrite buefy ".notification" style
}
</style>
