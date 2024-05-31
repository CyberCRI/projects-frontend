<template>
    <form class="form-ctn">
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

        <!-- Email -->
        <div class="sub-section">
            <TextInput v-model="form.email" @blur="v$.form.email.$touch">
                <label class="label">{{ $t('account.form.email') }}</label>
            </TextInput>
            <p v-for="error of v$.form.email.$errors" :key="error.$uid" class="error-description">
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
                    <input
                        type="checkbox"
                        id="google-checkbox"
                        name="google"
                        @change="setGoogleCheckbox($event)"
                    />
                    <label for="google-checkbox" class="list-label google-checkbox-label">{{
                        $t('account.form.create-google')
                    }}</label>
                </div>
            </div>

            <div class="spacer" />
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

        <div class="spacer" v-if="isAddMode" />

        <div v-if="isAddMode" class="sub-section" ref="groups">
            <h2 class="title">{{ $t('account.form.groups') }}</h2>
            <p class="sub-title">{{ $t('account.form.groups-description') }}</p>

            <div v-if="selectedGroups.length > 0" class="current-groups-ctn">
                <div v-for="group in selectedGroups" :key="group.id">
                    <FilterValue
                        :label="group.name"
                        class="actionable"
                        icon="Close"
                        @click="addRemovePeopleGroup(group)"
                    />
                </div>
            </div>

            <ul v-if="isAddMode">
                <GroupHierarchyList
                    v-for="peopleGroup in peopleGroupsTree"
                    :key="peopleGroup.id"
                    :parent="peopleGroup"
                    @add-group="addRemovePeopleGroup"
                >
                    <input
                        type="checkbox"
                        :id="peopleGroup.id"
                        :name="peopleGroup.name"
                        :checked="peopleGroup.value"
                        @change="addRemovePeopleGroup(peopleGroup)"
                    />
                    <label
                        :for="peopleGroup.id"
                        class="list-label"
                        :class="{
                            'list-label--has-children': peopleGroup.children.length > 0,
                        }"
                        >{{ peopleGroup.name }}</label
                    >
                </GroupHierarchyList>
            </ul>
        </div>

        <div class="spacer" v-if="!isAddMode" />

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
import GroupHierarchyList from '@/components/people/Account/GroupHierarchyList.vue'
import {
    postUser,
    patchUser,
    deleteUser,
    postUserPicture,
    patchUserPicture,
} from '@/api/people.service'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import { resetUserPassword } from '@/api/people.service.ts'
import { getPeopleGroupsHierarchy } from '@/api/organizations.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'

export default {
    name: 'AccountForm',

    emits: ['close'],

    mixins: [imageMixin],

    components: {
        FilterValue,
        TextInput,
        RadioButton,
        LpiButton,
        ConfirmModal,
        GroupHierarchyList,
        ImageEditor,
    },

    props: {
        isAddMode: {
            type: Boolean,
            default: true,
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
                roles_to_add: [],
                roles_to_remove: [],
                profile_picture: '',
                create_in_google: false,
                imageSizes: null,
            },
            showRemoveUserQuit: false,
            selectedRole: {},
            roles: [], // TODO this doesn't seem realy used

            selectedGroups: [],
            peopleGroupsTree: [],

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

        if (this.isAddMode) await this.setSelectedHierarchyGroups()

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

        setSelectedHierarchyGroups() {
            // We get the current org group hierarchy and we selected the groups already added to the user.
            getPeopleGroupsHierarchy(this.$store.getters['organizations/current'].code, {
                organizations: this.$store.getters['organizations/current'].code,
            }).then((peopleGroupsHierarchy) => {
                this.peopleGroupsTree = this.setGroupHierarchy(peopleGroupsHierarchy.children)
            })
        },

        setGroupHierarchy(children) {
            // this is a recursive call, as the groups have children, that have children, ...
            if (children && children.length > 0)
                return children.map((child) => ({
                    ...child,
                    value: false,
                    children: this.setGroupHierarchy(child.children),
                }))

            return []
        },

        setGoogleCheckbox(e) {
            this.form.create_in_google = e.target.checked
        },

        toggleShowRemoveUserVisible() {
            this.showRemoveUserQuit = !this.showRemoveUserQuit
        },

        updateRole(role) {
            this.selectedRole = role

            // dead code ?
            // if (role && role.id !== 0) this.form.groups_ids = [role.id]
            // else this.form.groups_ids = []
        },

        addRemovePeopleGroup(group) {
            group.value = !group.value
            const index = this.selectedGroups.findIndex((grp) => grp.id === group.id)

            if (index !== -1) {
                this.selectedGroups.splice(index, 1)
            } else this.selectedGroups.push(group)

            this.form.roles_to_add = [
                ...this.selectedGroups.map((group) => {
                    for (const role of group.roles) {
                        if (role.split(':')[2] === 'members') {
                            return role
                        }
                    }
                }),
            ]
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
                const usersRoles =
                    this.selectedRole.value === 0
                        ? []
                        : [this.selectedRole.value, ...this.form.roles_to_add]

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

                    usersRoles.forEach((role) => {
                        formData.append('roles_to_add', role)
                    })
                    ;(this.form.roles_to_remove || []).forEach((role) => {
                        formData.append('roles_to_remove', role)
                    })
                    // if role is none remove also organization role
                    if (this.selectedUser && this.selectedRole.value === 0) {
                        formData.append(
                            'roles_to_remove',
                            `organization:#${this.$store.getters['organizations/current'].id}:${this.selectedUser.current_org_role}`
                        )
                    }

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
                        roles_to_add: [...usersRoles],
                        roles_to_remove:
                            // if role is none remove also organization role
                            this.selectedUser && this.selectedRole.value === 0
                                ? [
                                      `organization:#${this.$store.getters['organizations/current'].id}:${this.selectedUser.current_org_role}`,
                                  ]
                                : [],
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
            }
        }

        .current-groups-ctn {
            display: flex;
            flex-wrap: wrap;
            gap: $space-s;
            margin-bottom: $space-l;
        }

        .password-btn-ctn {
            padding-top: 24px;
            gap: 12px;
            display: inline-flex;
        }

        .confirm-ctn {
            gap: 12px;
            display: inline-flex;
            border-top: $border-width-s solid $lighter-gray;
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

.google-checkbox-label {
    display: inline;
}
</style>
