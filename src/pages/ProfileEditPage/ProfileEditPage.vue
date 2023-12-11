<template>
    <div>
        <div class="my-profile-edit page-section-medium">
            <h1 class="title">{{ $t('profile.edit.edit-my-profile') }}</h1>
            <p class="notice">
                {{ $t('profile.edit.notice') }}
                <a href="/help">{{ $t('profile.edit.help') }}</a>
            </p>
            <div class="body">
                <ProfileEditTabs :user="user" @profile-edited="onProfileEdited" />
            </div>
        </div>
    </div>
</template>
<script>
import { getUser } from '@/api/people.service.ts'
import ProfileEditTabs from './Tabs/ProfileEditTabs.vue'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
export default {
    name: 'ProfileEditPage',

    components: {
        ProfileEditTabs,
    },

    mixins: [onboardingStatusMixin],

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
        userKId: {
            type: [String, null],
            required: false,
            default: null,
        },
    },

    async mounted() {
        await this.loadUser()
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.userKId || this.$store.getters['users/kid'])
                // safe check for isSelf beacuse this.userKId might be a slug in fact
            } catch (error) {
                console.error(error)
            }
        },

        async onProfileEdited() {
            if (this.user?.keycloak_id == this.$store.getters['users/kid']) {
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
    padding-top: $font-size-3xl;

    a {
        color: $primary-dark;
        font-weight: 700;
    }
}

.body {
    padding-top: $font-size-7xl;
    padding-bottom: $space-2xl;
}
</style>
