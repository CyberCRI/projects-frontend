<template>
    <div class="page-section-extra-wide profile-page">
        <UserProfile
            :key="userId"
            :user-id="userId"
            :show-page-link="false"
            @user-not-found="display404"
        />
    </div>
</template>

<script>
import UserProfile from '@/components/people/UserProfile.vue'

export default {
    name: 'UserProfilePage',

    components: {
        UserProfile,
    },

    props: {
        userId: {
            type: [String, Number],
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
    padding-top: 6.5rem;
    padding-bottom: 6.5rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
}
</style>
