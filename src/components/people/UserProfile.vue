<template>
    <div v-if="!user || isLoading" class="loader">
        <LoaderSimple />
    </div>
    <div v-else class="user-profile">
        <div class="profile-links" v-if="showPageLink || isSelf || canEditUser">
            <LinkButton
                v-if="showPageLink"
                class="page-btn"
                btn-icon="Eye"
                :label="$t('profile.go-to-page')"
                :to="{
                    name: 'ProfileOtherUser',
                    params: { userId: user?.slug || userId },
                }"
            />

            <LinkButton
                v-if="isSelf || canEditUser"
                class="edit-btn"
                btn-icon="Pen"
                :label="editButtonLabel"
                :to="editProfileLink"
                data-test="edit-profile"
            />
        </div>

        <!-- Profile Header -->
        <ProfileHeader class="profile-header" v-if="user && !isLoading" :user="user" />

        <ProfileTabs
            v-if="user && !isLoading"
            :user="user"
            :is-current-user="userId === null"
            @close="$emit('close')"
        />
    </div>
</template>

<script>
import ProfileHeader from '@/components/people/FullProfile/ProfileHeader.vue'
import permissions from '@/mixins/permissions.ts'
import ProfileTabs from '@/pages/UserProfilePage/Tabs/ProfileTabs.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { getUser } from '@/api/people.service.ts'
import LinkButton from '@/components/base/button/LinkButton.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'UserProfile',

    mixins: [permissions],

    emits: ['user-not-found', 'close'],

    components: {
        LinkButton,
        LoaderSimple,
        ProfileTabs,
        ProfileHeader,
    },

    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },

    props: {
        userId: {
            type: Number,
            default: null,
        },
        showPageLink: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            user: null,

            // TODO: add back once we can edit user
            // projectUser: null,
            // isEditMode: false,
            // canEdit: false,
            // payload: {
            //     editorShortDescription: {
            //         savedContent: '',
            //         originalContent: '',
            //     },
            //     editorProfessionalDescription: {
            //         savedContent: '',
            //         originalContent: '',
            //     },
            //     editorPersonalDescription: {
            //         savedContent: '',
            //         originalContent: '',
            //     },
            // },
            isLoading: true,
        }
    },

    async mounted() {
        try {
            if (!this.userId) {
                // get the connected user
                this.user = await this.usersStore.getUser(this.usersStore.id, true)
            } else {
                // get another user
                this.user = await getUser(this.userId, true)
            }
        } catch (err) {
            // TODO distinguish 404 from real error
            this.$emit('user-not-found', err)
        } finally {
            this.isLoading = false
        }
    },

    computed: {
        connectedUser() {
            return this.usersStore.userFromApi
        },

        isSelf() {
            return this.connectedUser && this.user.id === this.connectedUser.id
        },

        editButtonLabel() {
            return this.isSelf
                ? this.$t('profile.edit.edit-your-profile')
                : this.$t('profile.edit.edit')
        },
        editProfileLink() {
            return this.isSelf
                ? { name: 'ProfileEdit' }
                : {
                      name: 'ProfileEditOtherUser',
                      params: { userId: this.user?.slug || this.userId },
                  }
        },
    },

    methods: {
        // TODO: add back once we can edit user
        // initPayloads() {
        //     this.payload = {
        //         editorShortDescription: {
        //             savedContent: this.user.short_description,
        //             originalContent: this.user.short_description,
        //         },
        //         editorProfessionalDescription: {
        //             savedContent: this.user.professional_description,
        //             originalContent: this.user.professional_description,
        //         },
        //         editorPersonalDescription: {
        //             savedContent: this.user.personal_description,
        //             originalContent: this.user.personal_description,
        //         },
        //     }
        // },
        // updateContent(selectedEditor, htmlContent) {
        //     this.payload[selectedEditor].savedContent = htmlContent
        // },
    },
}
</script>

<style lang="scss" scoped>
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}

.user-profile {
    .profile-links {
        display: inline-flex;
        width: 100%;
        justify-content: flex-end;
        padding-bottom: 24px;
        text-transform: none;
        gap: $space-unit;
    }

    @media screen and (min-width: $min-tablet) {
        padding: 0;
    }

    .profile-header {
        margin-bottom: pxToRem(42px);
    }

    .tabs {
        width: 100%;
    }
}
</style>
