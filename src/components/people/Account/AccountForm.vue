<template>
  <form class="form-ctn">
    <!-- Email -->
    <AccountSection>
      <TextInput v-model="form.email" @blur="v$.form.email.$touch">
        <label class="label">{{ $t('account.form.email') }}</label>
      </TextInput>
      <FieldErrors :errors="v$.form.email.$errors" />
    </AccountSection>

    <template v-if="isInviteMode">
      <p class="invite-notice">
        {{ $t('account.user-exists-in-other-org') }}
      </p>

      <OtherOrgUserCard v-if="selectedUser" class="other-org-user-card" :user="selectedUser" />
    </template>
    <template v-else-if="!isLoading">
      <AccountInfos
        :model-value="form"
        :v$="v$"
        @update:model-value="form = { ...form, ...$event }"
      />

      <div class="spacer" />

      <!-- Google -->
      <template v-if="isAddMode && hasGoogleSync">
        <AccountSection :section-title="$t('account.form.google')">
          <div>
            <div class="checkbox-item">
              <LpiCheckbox
                id="google-checkbox"
                v-model="form.create_in_google"
                :label="$t('account.form.create-google')"
              />
            </div>
          </div>
          <div v-if="form.create_in_google && orgUnits.length">
            <label class="label">Organizational unit</label>
            <LpiSelect v-model="form.google_organizational_unit" :options="orgUnits" />
          </div>
        </AccountSection>

        <div class="spacer" />
      </template>
    </template>

    <!-- Rights -->
    <AccountSection
      ref="rights"
      :section-title="$t('account.form.rights')"
      :section-notice="$t('account.form.rights-description') + ' ' + organization.name"
    >
      <div class="role-options-ctn">
        <RadioButton
          v-for="roleOption in roleOptions"
          :key="roleOption.value"
          v-model="selectedRole"
          as-button
          :label="roleOption.label"
          :value="roleOption.value"
        />
      </div>
    </AccountSection>

    <div class="spacer" />

    <template v-if="hasRoleInCurrentOrg">
      <AccountGroupsForm v-model="selectedGroups" />

      <div class="spacer" />

      <AccountSection v-if="!isAddMode" ref="password" :section-title="$t('account.reset-delete')">
        <div class="password-btn-ctn">
          <LpiButton
            btn-icon="Lock"
            :label="$t('account.reset-password')"
            :secondary="true"
            @click="resetPassword"
          />
          <LpiButton
            btn-icon="TrashCanOutline"
            :label="$t('account.delete-account')"
            :secondary="true"
            @click="toggleShowRemoveUserVisible"
          />
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
      </AccountSection>
    </template>

    <AccountSection>
      <div class="confirm-ctn">
        <LpiButton
          :disabled="asyncSave"
          :label="$filters.capitalize($t('common.cancel'))"
          :secondary="true"
          class="footer__left-button"
          data-test="close-button"
          @click="close"
        />

        <LpiButton
          :disabled="asyncSave || v$.$invalid"
          :label="$filters.capitalize($t('common.confirm'))"
          :btn-icon="asyncSave ? 'LoaderSimple' : null"
          :secondary="false"
          class="footer__right-button"
          data-test="confirm-button"
          @click="confirm"
        />
      </div>
    </AccountSection>
  </form>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import RadioButton from '@/components/base/form/RadioButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import {
  imageSizesFormData,
  imageSizesFormDataPost,
  pictureApiToImageSizes,
} from '@/functs/imageSizesUtils.ts'
import {
  postUser,
  patchUser,
  deleteUser,
  postUserPicture,
  patchUserPicture,
} from '@/api/people.service'
import { resetUserPassword } from '@/api/people.service.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import OtherOrgUserCard from '@/components/people/Account/OtherOrgUserCard.vue'
import AccountGroupsForm from '@/components/people/Account/AccountGroupsForm.vue'
import AccountInfos from '@/components/people/Account/AccountInfos.vue'
import AccountSection from '@/components/people/Account/AccountSection.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { VALID_NAME_REGEX } from '@/functs/constants.ts'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import { getOrgUnits } from '@/api/google.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'AccountForm',

  components: {
    TextInput,
    RadioButton,
    LpiButton,
    ConfirmModal,
    OtherOrgUserCard,
    LpiCheckbox,
    AccountGroupsForm,
    AccountInfos,
    AccountSection,
    FieldErrors,
    LpiSelect,
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

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      v$: useValidate(),
      form: {
        given_name: '',
        family_name: '',
        job: '',
        email: '',
        profile_picture: null,
        create_in_google: false,
        imageSizes: null,
        google_organizational_unit: null,
      },
      selectedGroups: {},
      previousGroups: {}, // memo to compare with selected groups on save
      showRemoveUserQuit: false,
      selectedRole: '',
      isLoading: true,
      asyncSave: false,
      orgUnits: [],
    }
  },

  validations() {
    return {
      form: {
        given_name: {
          required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
          alphanum: helpers.withMessage(
            this.$t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        family_name: {
          required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
          alphanum: helpers.withMessage(
            this.$t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        job: {
          required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
        },
        email: {
          required: helpers.withMessage(this.$t('project.form.title-errors.required'), required),
          email: helpers.withMessage(this.$t('form.report.email.format'), email),
        },
      },
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },
    hasRoleInCurrentOrg() {
      return this.selectedRole && this.selectedRole != 0
    },

    hasGoogleSync() {
      // whether to give option to create user in google too
      return this.organizationsStore.current.google_sync_enabled
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
          value: `organization:#${this.organizationsStore.current.id}:users`,
        },
        {
          name: 'facilitators',
          label: this.$t('account.role.facilitator'),
          value: `organization:#${this.organizationsStore.current.id}:facilitators`,
        },
        {
          name: 'admins',
          label: this.$t('account.role.admin'),
          value: `organization:#${this.organizationsStore.current.id}:admins`,
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
            if (this.selectedRole && this.selectedRole === this.roleNone.value) {
              // using roles[0] instead of roleOptions[0]
              // avoid trouble with awaiting computed value to be ready
              this.selectedRole = this.roleOptions[0].value
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

  async mounted() {
    if (this.isAddMode && this.hasGoogleSync) {
      this.orgUnits = (await getOrgUnits()).map((unit) => ({
        label: unit,
        value: unit,
      }))
    }

    if (this.selectedUser) await this.setFormFromSelectedUser()
    else {
      this.selectedRole = this.isAddMode ? this.roleOptions[0].value : this.roleNone.value
    }

    if (this.isAddMode) {
      // fix for undefined profile_picture
      if (!this.form.profile_picture) {
        this.form.profile_picture = null
      }
      if (this.hasGoogleSync && this.orgUnits.length && !this.form.google_organizational_unit) {
        this.form.google_organizational_unit = this.orgUnits[0].value
      }
    }

    this.isLoading = false
  },

  methods: {
    async resetPassword() {
      try {
        await resetUserPassword(this.selectedUser.id)
        this.toaster.pushSuccess(this.$t('account.password-reset.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('account.password-reset.error')} (${error})`)
        console.error(error)
      }
    },

    async setFormFromSelectedUser() {
      if (this.selectedUser.current_org_role) {
        this.selectedRole = this.roleOptions.find(
          (role) => role.name === this.selectedUser.current_org_role
        )?.value
      } else this.selectedRole = this.roleOptions[0].value

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
        profile_picture: this.selectedUser.profile_picture || null,
        imageSizes: pictureApiToImageSizes(this.selectedUser.profile_picture),
        google_organizational_unit: this.selectedUser.google_organizational_unit,
      }
    },

    // setGoogleCheckbox(e) {
    //     this.form.create_in_google = e.target.checked
    // },

    toggleShowRemoveUserVisible() {
      this.showRemoveUserQuit = !this.showRemoveUserQuit
    },

    // updateRole(role) {
    //     this.selectedRole = role

    //     // dead code ?
    //     // if (role && role.id !== 0) this.form.groups_ids = [role.id]
    //     // else this.form.groups_ids = []
    // },

    async deleteUser() {
      try {
        await deleteUser(this.selectedUser.id)
        this.toaster.pushSuccess(this.$t('account.delete-success'))
      } catch (err) {
        this.toaster.pushError(`${this.$t('account.error')} (${err})`)
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
              groupRolesToRemove.push(`peoplegroup:${groupId}:${this.previousGroups[groupId]}`)
          }
        })

        const allRolesToAdd = [...groupRolesToAdd]
        const allRolesToRemove = [...groupRolesToRemove]

        if (this.selectedRole != 0) {
          allRolesToAdd.push(this.selectedRole)
        } else if (this.selectedUser) {
          allRolesToRemove.push(
            `organization:#${this.organizationsStore.current.id}:${this.selectedUser.current_org_role}`
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
            formData.append('google_organizational_unit', this.form.google_organizational_unit)
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

          this.toaster.pushSuccess(this.$t('account.create-success'))
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
            formData.append('file', this.form['profile_picture'], this.form['profile_picture'].name)
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
          this.toaster.pushSuccess(this.$t('account.update-success'))
        }
      } catch (err) {
        this.toaster.pushError(`${this.$t('account.error')} (${err})`)
        console.error(err)
      } finally {
        this.asyncSave = false
        this.close()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.form-ctn {
  padding: $space-l 0;

  .label {
    font-weight: 500;
    font-size: $font-size-m;
    padding-bottom: $space-m;
  }

  .role-options-ctn {
    display: inline-flex;
    margin-top: $space-l;
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
