<template>
    <div>
        <div class="my-profile-edit narrow-body">
            <h1 class="title">{{ $t('profile.edit.edit-my-profile') }}</h1>
            <p class="notice">
                {{ $t('profile.edit.notice') }}
                <a href="/help">{{ $t('profile.edit.help') }}</a>
            </p>
            <div class="body">
                <ProfileEditTabs :user="user" />
            </div>
        </div>
    </div>
</template>
<script>
import { getUser } from '@/api/auth/auth.service'
import ProfileEditTabs from './Tabs/ProfileEditTabs.vue'
export default {
    name: 'ProfileEditLayout',

    components: {
        ProfileEditTabs,
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
            } catch (error) {
                console.error(error)
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
