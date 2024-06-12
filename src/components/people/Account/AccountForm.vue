<template>
    <form class="form-ctn">
        <!-- Email -->
        <div class="sub-section">
            <TextInput v-model="form.email" @blur="v$.form.email.$touch">
                <label class="label">{{ $t('account.form.email') }}</label>
            </TextInput>
            <p v-for="error of v$.form.email.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
        </div>

        <template v-if="isInviteMode">
            <p class="invite-notice">
                {{ $t('account.user-exists-in-other-org') }}
            </p>

            <OtherOrgUserCard
                class="other-org-user-card"
                :user="selectedUser"
                v-if="selectedUser"
            />
        </template>
        <template v-else>
            <!-- First Name -->
            <div class="sub-section" ref="info">
                <TextInput v-model="form.given_name" @blur="v$.form.given_name.$touch">
                    <label class="label">{{ $t('account.form.first-name') }}</label>
                </TextInput>
                <p
                    v-for="error of v$.form.given_name.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
            </div>

            <!-- Last Name -->
            <div class="sub-section">
                <TextInput v-model="form.family_name" @blur="v$.form.family_name.$touch">
                    <label class="label">{{ $t('account.form.last-name') }}</label>
                </TextInput>
                <p
                    v-for="error of v$.form.family_name.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
            </div>

            <!-- Title -->
            <div class="sub-section">
                <TextInput v-model="form.job" @blur="v$.form.job.$touch">
                    <label class="label">{{ $t('account.form.title') }}</label>
                </TextInput>
                <p v-for="error of v$.form.job.$errors" :key="error.$uid" class="error-description">
                    {{ error.$message }}
                </p>
            </div>

            <!-- Picture -->
            <div class="sub-section">
                <label class="label">{{ $filters.capitalize($t('project.image-header')) }}</label>
                <ImageEditor
                    :picture-alt="`${form.name} image`"
                    :contain="true"
                    :round-picture="true"
                    v-model:imageSizes="form.imageSizes"
                    v-model:picture="form.profile_picture"
                    :default-picture="defaultPictures"
                ></ImageEditor>
            </div>

            <div class="spacer" />

            <!-- Google -->
            <template v-if="isAddMode && hasGoogleSync">
                <div class="sub-section">
                    <h2 class="title">{{ $t('account.form.google') }}</h2>
                    <div>
                        <div class="checkbox-item">
                            <LpiCheckbox
                                id="google-checkbox"
                                :label="$t('account.form.create-google')"
                                v-model="form.create_in_google"
                            />
                        </div>
                    </div>
                </div>

                <div class="spacer" />
            </template>
        </template>

        <!-- Rights -->
        <div class="sub-section" ref="rights">
            <h2 class="title">{{ $t('account.form.rights') }}</h2>
            <p>{{ $t('account.form.rights-description') }}</p>

            <div class="role-options-ctn">
                <div v-for="roleOption in roleOptions" :key="roleOption.id" class="role-options">
                    <RadioButton
                        :label="roleOption.label"
                        v-model="selectedRole"
                        @update:model-value="updateRole(roleOption)"
                        :checked="selectedRole?.name === roleOption.name"
                    />
                </div>
            </div>
        </div>

        <div class="spacer" />

        <template v-if="hasRoleInCurrentOrg">
            <AccountGroupsForm v-model="selectedGroups" />

            <div class="spacer" />

            <div v-if="!isAddMode" class="sub-section" ref="password">
                <h2 class="title">{{ $t('account.reset-delete') }}</h2>

                <div class="password-btn-ctn">
                    <LpiButton
                        @click="resetPassword"
                        btn-icon="Lock"
                        :label="$t('account.reset-password')"
                        :secondary="true"
                    ></LpiButton>
                    <LpiButton
                        btn-icon="TrashCanOutline"
                        :label="$t('account.delete-account')"
                        :secondary="true"
                        @click="toggleShowRemoveUserVisible"
                    ></LpiButton>
                    <ConfirmModal
                        v-if="showRemoveUserQuit"
                        :content="$t('common.remove-user')"
                        :title="$t('project.remove-user-title')"
                        :cancel-button-label="'common.cancel'"
                        :confirm-button-label="'project.remove-user'"
                        @cancel="toggleShowRemoveUserVisible"
                        @confirm="deleteUser"
                    />
                </div>
            </div>
        </template>

        <div class="sub-section">
            <div class="confirm-ctn">
                <LpiButton
                    :disabled="asyncSave"
                    :label="$filters.capitalize($t('common.cancel'))"
                    :secondary="true"
                    class="footer__left-button"
                    @click="close"
                    data-test="close-button"
                />

                <LpiButton
                    :disabled="asyncSave"
                    :label="$filters.capitalize($t('common.confirm'))"
                    :btn-icon="asyncSave ? 'LoaderSimple' : null"
                    :secondary="false"
                    class="footer__right-button"
                    @click="confirm"
                    data-test="confirm-button"
                />
            </div>
        </div>
    </form>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import RadioButton from '@/components/base/form/RadioButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import {
    imageSizesFormData,
    imageSizesFormDataPost,
    pictureApiToImageSizes,
} from '@/functs/imageSizesUtils.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import {
    postUser,
    patchUser,
    deleteUser,
    postUserPicture,
    patchUserPicture,
} from '@/api/people.service'
import { resetUserPassword } from '@/api/people.service.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import OtherOrgUserCard from '@/components/people/Account/OtherOrgUserCard.vue'
import AccountGroupsForm from '@/components/people/Account/AccountGroupsForm.vue'

export default {
    name: 'AccountForm',

    emits: ['close'],

    mixins: [imageMixin],

    components: {
        TextInput,
        RadioButton,
        LpiButton,
        ConfirmModal,
        ImageEditor,
        OtherOrgUserCard,
        LpiCheckbox,
        AccountGroupsForm,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
        },
        isInviteMode: {
            type: Boolean,
            default: false,
        },

        selectedUser: {
            type: Object,
            default: null,
        },
    },

    data() {
        const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
            return `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-${index}.png`
        })
        return {
            v$: useValidate(),
            form: {
                given_name: '',
                family_name: '',
                job: '',
                email: '',
                profile_picture: '',
                create_in_google: false,
                imageSizes: null,
            },
            selectedGroups: {},
            previousGroups: {}, // memo to compare with selected groups on save
            showRemoveUserQuit: false,
            selectedRole: {},
            roles: [], // TODO this doesn't seem realy used

            isLoading: false,
            asyncSave: false,
            defaultPictures,
        }
    },

    validations() {
        return {
            form: {
                given_name: {
                    required: helpers.withMessage(
                        this.$t('project.form.title-errors.required'),
                        required
                    ),
                },
                family_name: {
                    required: helpers.withMessage(
                        this.$t('project.form.title-errors.required'),
                        required
                    ),
                },
                job: {
                    required: helpers.withMessage(
                        this.$t('project.form.title-errors.required'),
                        required
                    ),
                },
                email: {
                    required: helpers.withMessage(
                        this.$t('project.form.title-errors.required'),
                        required
                    ),
                },
            },
        }
    },

    computed: {
        hasRoleInCurrentOrg() {
            return this.selectedRole && this.selectedRole.value != 0
        },

        hasGoogleSync() {
            // whether to give option to create user in google too
            return this.$store.getters['organizations/current'].google_sync_enabled
        },
        roleNone() {
            return {
                value: 0,
                name: 'none',
                label: this.$t('account.role.none'),
            }
        },

        roleOptions() {
            const res = []
            const roles = [
                {
                    name: 'users',
                    label: this.$t('account.role.user'),
                    value: `organization:#${this.$store.getters['organizations/current'].id}:users`,
                },
                {
                    name: 'facilitators',
                    label: this.$t('account.role.facilitator'),
                    value: `organization:#${this.$store.getters['organizations/current'].id}:facilitators`,
                },
                {
                    name: 'admins',
                    label: this.$t('account.role.admin'),
                    value: `organization:#${this.$store.getters['organizations/current'].id}:admins`,
                },
            ]

            // user created in google can't have "none" role
            if (!this.form.create_in_google && !this.isAddMode) {
                res.push(this.roleNone)
            }
            res.push(...roles)
            return res
        },
    },

    async mounted() {
        if (this.selectedUser) await this.setFormFromSelectedUser()
        else {
            this.selectedRole = this.isAddMode ? this.roleOptions[0] : this.roleNone
        }

        this.isLoading = false
    },

    methods: {
        async resetPassword() {
            try {
                await resetUserPassword(this.selectedUser.id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('account.password-reset.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('account.password-reset.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            }
        },

        async setFormFromSelectedUser() {
            if (this.selectedUser.current_org_role) {
                this.selectedRole = this.roleOptions.find(
                    (role) => role.name === this.selectedUser.current_org_role
                )
            } else this.selectedRole = this.roleOptions[0]

            // can contain groups from other orgs
            // they'll be ignored in AccountGroupForm
            // but we need to keep them so they are not removed on save
            this.selectedGroups =
                this.selectedUser?.roles?.reduce((acc, roleString) => {
                    const [scope, groupId, role] = roleString.split(':')
                    if (scope !== 'peoplegroup') return acc
                    return {
                        ...acc,
                        [groupId]: role,
                    }
                }, {}) || {}

            this.previousGroups = { ...this.selectedGroups }

            this.form = {
                ...this.form,
                given_name: this.selectedUser.given_name,
                family_name: this.selectedUser.family_name,
                job: this.selectedUser.job,
                email: this.selectedUser.email,
                profile_picture: this.selectedUser.profile_picture,
                imageSizes: pictureApiToImageSizes(this.selectedUser.profile_picture),
            }
        },

        // setGoogleCheckbox(e) {
        //     this.form.create_in_google = e.target.checked
        // },

        toggleShowRemoveUserVisible() {
            this.showRemoveUserQuit = !this.showRemoveUserQuit
        },

        updateRole(role) {
            this.selectedRole = role

            // dead code ?
            // if (role && role.id !== 0) this.form.groups_ids = [role.id]
            // else this.form.groups_ids = []
        },

        async deleteUser() {
            try {
                await deleteUser(this.selectedUser.id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('account.delete-success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('account.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.close()
            }
        },

        close() {
            this.$emit('close')
        },

        async confirm() {
            this.asyncSave = true
            try {
                const groupRolesToAdd = []
                const groupRolesToRemove = []

                Object.entries(this.selectedGroups).forEach(([groupId, role]) => {
                    // use loose equality to match false and undefined
                    if (this.previousGroups[groupId] != role) {
                        if (role) groupRolesToAdd.push(`peoplegroup:${groupId}:${role}`)
                        if (this.previousGroups[groupId])
                            groupRolesToRemove.push(
                                `peoplegroup:${groupId}:${this.previousGroups[groupId]}`
                            )
                    }
                })

                const allRolesToAdd = [...groupRolesToAdd]
                const allRolesToRemove = [...groupRolesToRemove]

                if (this.selectedRole.value != 0) {
                    allRolesToAdd.push(this.selectedRole.value)
                } else if (this.selectedUser) {
                    allRolesToRemove.push(
                        `organization:#${this.$store.getters['organizations/current'].id}:${this.selectedUser.current_org_role}`
                    )
                }

                // we don't have to compare previousGroups with selectedGroups for 'deleted one'
                // because they still are in selectedGroups with a false value
                // and so are handled by the previous loop

                if (this.isAddMode) {
                    // CREATE

                    const formData = new FormData()

                    ;['given_name', 'family_name', 'job', 'email'].forEach((key) => {
                        formData.append(key, this.form[key])
                    })

                    if (this.form.create_in_google) {
                        // note true will convert to "true" and be coerced to True by backend
                        // we dont add the key if it is false, as backend will receive "false" (the string)
                        // that will be coerced to boolean True
                        formData.append('create_in_google', true)
                    }

                    allRolesToAdd.forEach((role) => {
                        formData.append('roles_to_add', role)
                    })
                    allRolesToRemove.forEach((role) => {
                        formData.append('roles_to_remove', role)
                    })

                    if (this.form.profile_picture instanceof File) {
                        formData.append(
                            'profile_picture_file',
                            this.form['profile_picture'],
                            this.form['profile_picture'].name
                        )
                    }

                    imageSizesFormDataPost(formData, this.form.imageSizes)

                    await postUser(formData)

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('account.create-success'),
                        type: 'success',
                    })
                } else {
                    // UPDATE
                    // patch still use old api style
                    // where image is separated from generam payload
                    const payload = {
                        ...this.form,
                        profile_picture: this.form.profile_picture,
                        roles_to_add: [...allRolesToAdd],
                        roles_to_remove: [...allRolesToRemove],
                    }

                    const formData = new FormData()

                    imageSizesFormData(formData, this.form.imageSizes)

                    if (payload.profile_picture instanceof File) {
                        formData.append(
                            'file',
                            this.form['profile_picture'],
                            this.form['profile_picture'].name
                        )
                    }

                    const user = await patchUser(this.selectedUser.id, payload)

                    if (payload.profile_picture instanceof File) {
                        const image = await postUserPicture(user.id, formData)

                        formData.delete('file')
                        payload.profile_picture.id = image.id

                        await patchUserPicture(user.id, image.id, formData)
                    } else if (user && user.profile_picture) {
                        await patchUserPicture(user.id, user.profile_picture.id, formData)
                    }
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('account.update-success'),
                        type: 'success',
                    })
                }
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('account.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.asyncSave = false
                this.close()
            }
        },
    },
    watch: {
        selectedUser: {
            handler(neo) {
                if (neo) this.setFormFromSelectedUser()
            },
            immediate: true,
        },

        'form.create_in_google': {
            handler(neo, old) {
                if (neo !== old) {
                    if (neo) {
                        // creating user in google forbid having role "none"
                        if (this.selectedRole && this.selectedRole.name === this.roleNone.name) {
                            // using roles[0] instead of roleOptions[0]
                            // avoid trouble with awaiting computed value to be ready
                            this.updateRole(this.roleOptions[0])
                        }
                    }
                    // not sure if we want to do this
                    // else {
                    //     this.updateRole(this.roleNone)
                    // }
                }
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.form-ctn {
    padding: $space-l 0;

    .sub-section {
        padding-top: $space-xl;

        .title {
            font-weight: 700;
            font-size: $font-size-l;
            color: $black;
        }

        .sub-title {
            margin: pxToRem(16px) 0;
        }

        .list-label {
            font-size: $font-size-s;

            &--has-children {
                font-weight: 700;
                color: $primary-dark;
            }
        }

        .label {
            font-weight: 500;
            font-size: $font-size-m;
            padding-bottom: $space-m;
        }

        .role-options-ctn {
            display: inline-flex;
            margin-top: $space-l;

            .role-options {
                text-transform: capitalize;
                border: $border-width-s solid $primary-dark;
                border-radius: $border-radius-xs;
                padding: $space-m $space-s;
                margin-right: $space-m;

                &:hover {
                    background-color: $primary-lighter;
                }
            }
        }

        .password-btn-ctn {
            padding-top: 24px;
            gap: 12px;
            display: inline-flex;
        }

        .confirm-ctn {
            gap: 12px;
            display: inline-flex;
            width: 100%;
            padding: 12px 0;
            justify-content: center;
        }
    }

    .spacer {
        margin-top: $space-xl;
        border-bottom: $border-width-s solid $lighter-gray;
    }
}

.footer {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: $border-width-s solid $lighter-gray;
    color: $primary-dark;
    font-weight: 700;
    padding-top: $space-l;
    padding-bottom: $space-l;
    position: sticky;
    bottom: 0;
    background: $white;

    button ~ button {
        margin-left: $space-m;
        text-transform: capitalize;
    }
}

.invite-notice,
.other-org-user-card {
    margin: $space-l 0;
}

.checkbox-item {
    border: 1px solid $primary-dark;
    padding: $space-m;
    margin: $space-s pxToRem(16px) $space-s 0;
    border-radius: $border-radius-xs;
    display: flex;
    align-items: center;
    text-align: right;
    width: max-content;

    &:hover {
        background-color: $primary-lighter;
    }

    > label {
        font-weight: 700;
        font-size: $font-size-m;
        line-height: $line-height-tight;
        color: $primary-dark;
        margin: 0;
        cursor: pointer;
        margin-left: $space-s;
    }
}
</style>
