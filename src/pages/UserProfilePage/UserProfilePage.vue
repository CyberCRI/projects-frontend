<template>
    <div class="profile-page">
        <UserProfile
            :key="userKId"
            :kid="userKId"
            :show-page-link="false"
            @user-not-found="display404"
        />
    </div>
</template>

<script>
import UserProfile from '@/components/Profile/UserProfile.vue'

export default {
    name: 'UserProfilePage',

    components: {
        UserProfile,
    },

    props: {
        userKId: {
            type: String,
            default: null,
        },
    },
    methods: {
        display404() {
            this.$router.replace({
                name: 'page404',
                params: { pathMatch: this.$route.path.substring(1).split('/') },
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.profile-page {
    padding: 6.5rem 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
}

@media screen and (min-width: $min-tablet) {
    .profile-page {
        padding: 6.5rem $space-2xl;
    }
}
</style>
