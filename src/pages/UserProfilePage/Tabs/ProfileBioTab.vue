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
import UserDescriptions from '@/components/people/UserDescriptions.vue'
import useUsersStore from '@/stores/useUsers.ts'

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
    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },

    computed: {
        isCurrentUser() {
            return this.usersStore.id === this.user.id
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
    color: $mid-gray;
    font-weight: 700;
}
</style>
