<template>
    <div>
        <div class="my-profile-edit page-section-medium">
            <h1 v-if="user && isSelf" class="title">{{ $t('profile.edit.edit-my-profile') }}</h1>
            <h1 v-else-if="user" class="title">
                {{ $t('profile.edit.edit-other-profile', { name: username }) }}
            </h1>
            <p class="notice">
                {{ $t('profile.edit.notice') }}
                <router-link :to="{ name: 'Help' }">{{ $t('profile.edit.help') }}</router-link>
            </p>
            <div class="body">
                <ProfileEditTabs :user="user" :is-self="isSelf" @profile-edited="onProfileEdited" />
            </div>
        </div>
    </div>
</template>
<script>
import { getUser } from '@/api/people.service.ts'
import ProfileEditTabs from './Tabs/ProfileEditTabs.vue'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import useUsersStore from '@/stores/useUsers.ts'
export default {
    name: 'ProfileEditPage',

    components: {
        ProfileEditTabs,
    },

    mixins: [onboardingStatusMixin],
    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },
    provide() {
        return {
            profileEditReloadUser: this.loadUser,
        }
    },
    data() {
        return {
            user: null,
        }
    },

    props: {
        userId: {
            type: [String, Number, null],
            required: false,
            default: null,
        },
    },

    async mounted() {
        await this.loadUser()
    },

    computed: {
        isSelf() {
            // safe check for isSelf beacuse this.userId might be a slug in fact
            return this.usersStore.userFromApi && this.user?.id === this.usersStore.userFromApi.id
        },
        username() {
            return this.user ? this.user.given_name + ' ' + this.user.family_name : ''
        },
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.userId || this.usersStore.id)
            } catch (error) {
                console.error(error)
            }
        },

        async onProfileEdited() {
            if (this.user?.id == this.usersStore.id) {
                this.onboardingTrap('complete_profile', false)
            }
        },
    },
}
</script>
<style scoped lang="scss">
.my-profile-edit {
    margin-top: $navbar-height;
}

.title,
.notice {
    text-align: center;
}

.title {
    padding-top: pxToRem(88px);
    font-size: $font-size-5xl;
}

.notice {
    padding-top: $layout-size-3xl;

    a {
        color: $primary-dark;
        font-weight: 700;
    }
}

.body {
    padding-top: $layout-size-7xl;
    padding-bottom: $space-2xl;
}
</style>
