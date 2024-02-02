<template>
    <div class="profile-bio">
        <!-- User descriptions -->
        <UserDescriptions
            v-if="user.personal_description || user.professional_description"
            :user="user"
        />
        <p v-else class="empty-field">{{ noDescription }}</p>
    </div>
</template>

<script>
import UserDescriptions from '@/components/Profile/UserDescriptions.vue'

export default {
    name: 'ProfileBioTab',

    components: {
        UserDescriptions,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    computed: {
        isCurrentUser() {
            return this.$store.getters['users/id'] === this.user.id
        },

        noDescription() {
            return this.isCurrentUser ? this.$t('me.no-bio') : this.$t('you.no-bio')
        },
    },
}
</script>

<style lang="scss" scoped>
.profile-bio {
    padding: $space-l 0;
}

.empty-field {
    color: $gray-8;
    font-weight: 700;
}
</style>
