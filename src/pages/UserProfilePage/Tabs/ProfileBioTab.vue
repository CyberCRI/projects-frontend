<template>
    <div class="profile-bio">
        <div class="header" v-if="isCurrentUser || canEditUser">
            <LinkButton
                class="edit-btn"
                btn-icon="Pen"
                :label="$t('common.edit')"
                :to="editBioLink"
                data-test="edit-bio"
            />
        </div>
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
import LinkButton from '@/components/base/button/LinkButton.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProfileBioTab',

    mixins: [permissions],

    components: {
        UserDescriptions,
        LinkButton,
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
        editBioLink() {
            return {
                name: 'ProfileEditBio' + (this.isCurrentUser ? '' : 'Other'),
                params: this.isCurrentUser ? {} : { userId: this.user.slug || this.user.id },
            }
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

.header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
