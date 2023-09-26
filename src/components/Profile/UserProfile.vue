<template>
    <div v-if="!user || isLoading" class="loader">
        <LoaderSimple />
    </div>
    <div v-else class="user-profile">
        <div class="profile-links" v-if="showPageLink || isSelf || canEditUser">
            <LpiButton
                v-if="showPageLink"
                class="page-btn"
                left-icon="Eye"
                :secondary="true"
                :no-border="true"
                :label="$t('profile.go-to-page')"
                @click="goToProfile"
            />

            <LpiButton
                v-if="isSelf || canEditUser"
                class="edit-btn"
                left-icon="Pen"
                :secondary="true"
                :no-border="true"
                :label="editButtonLabel"
                @click="editProfile"
            />
        </div>

        <!-- Profile Header -->
        <ProfileHeader class="profile-header" v-if="user && !isLoading" :user="user" />

        <ProfileTabs
            v-if="user && !isLoading"
            :user="user"
            :is-current-user="kid === null"
            @close="$emit('close')"
        />
    </div>
</template>

<script>
import ProfileHeader from '@/components/lpikit/FullProfile/ProfileHeader.vue'
import permissions from '@/mixins/permissions.ts'
import ProfileTabs from '@/components/Layouts/Profile/Tabs/ProfileTabs.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'
import { getUser } from '@/api/auth/auth.service.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'UserProfile',

    mixins: [permissions],

    emits: ['user-not-found', 'close'],

    components: {
        LpiButton,
        LoaderSimple,
        ProfileTabs,
        ProfileHeader,
    },

    props: {
        kid: {
            type: Object,
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
            projectUser: null,
            isEditMode: false,
            canEdit: false,
            payload: {
                editorShortDescription: {
                    savedContent: '',
                    originalContent: '',
                },
                editorProfessionalDescription: {
                    savedContent: '',
                    originalContent: '',
                },
                editorPersonalDescription: {
                    savedContent: '',
                    originalContent: '',
                },
            },
            isLoading: true,
        }
    },

    async mounted() {
        try {
            if (!this.kid) {
                // get the connected user
                this.user = await this.$store.dispatch(
                    'users/getUser',
                    this.$store.getters['users/kid']
                )
            } else {
                // get another user
                this.user = await getUser(this.kid)
            }
        } catch (err) {
            console.error(err)
            this.$emit('user-not-found', err)
        } finally {
            this.isLoading = false
        }
    },

    computed: {
        isSelf() {
            const connectedUser = this.$store.getters['users/userFromApi']
            return connectedUser && this.user.keycloak_id === connectedUser.keycloak_id
        },

        editButtonLabel() {
            return this.isSelf
                ? this.$t('profile.edit.edit-your-profile')
                : this.$t('profile.edit.edit')
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
        editProfile() {
            this.isSelf
                ? this.$router.push({ name: 'ProfileEdit' })
                : this.$router.push({ name: 'ProfileEditOtherUser', params: { userKId: this.kid } })
        },

        goToProfile() {
            this.$router.push({ name: 'ProfileOtherUser', params: { userKId: this.kid } })
        },
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
