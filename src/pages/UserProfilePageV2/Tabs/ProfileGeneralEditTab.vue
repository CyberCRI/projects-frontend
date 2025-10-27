<template>
  <div class="form-ctn">
    <!-- first name -->
    <div class="form-group">
      <TextInput
        v-model="form.first_name"
        :label="$t('profile.edit.general.first-name.label')"
        :placeholder="$t('profile.edit.general.first-name.placeholder')"
        data-test="first-name-input"
        @blur="v$.form.first_name.$validate"
      />
      <FieldErrors :errors="v$.form.first_name.$errors" />
    </div>

    <!-- last name -->
    <div class="form-group">
      <TextInput
        v-model="form.last_name"
        :label="$t('profile.edit.general.last-name.label')"
        :placeholder="$t('profile.edit.general.last-name.placeholder')"
        data-test="last-name-input"
        @blur="v$.form.last_name.$validate"
      />
      <FieldErrors :errors="v$.form.last_name.$errors" />
    </div>

    <!-- pronouns -->
    <div class="form-group">
      <TextInput
        v-model="form.pronouns"
        :placeholder="$t('profile.edit.general.pronouns.placeholder')"
        data-test="pronouns-input"
      >
        <label>{{ $t('profile.edit.general.pronouns.label') }}</label>
        <p class="notice">
          {{ $t('profile.edit.general.pronouns.notice') }}
        </p>
      </TextInput>
    </div>

    <!-- pro email -->
    <div class="form-group">
      <TextInput
        v-model="form.professional_email"
        :label="$t('profile.edit.general.professional-email.label')"
        :placeholder="$t('profile.edit.general.professional-email.placeholder')"
        :disabled="true"
        input-type="email"
        @blur="v$.form.professional_email.$validate"
      />
      <FieldErrors :errors="v$.form.professional_email.$errors" />
    </div>

    <!-- pro number -->
    <div class="form-group">
      <TextInput
        v-model="form.professional_number"
        :label="$t('profile.edit.general.professional-number.label')"
        :placeholder="$t('profile.edit.general.professional-number.placeholder')"
        data-test="professional-number-input"
      />
    </div>

    <!-- personal number -->
    <div class="form-group">
      <TextInput
        v-model="form.personal_number"
        :label="$t('profile.edit.general.personal-number.label')"
        :placeholder="$t('profile.edit.general.personal-number.placeholder')"
        data-test="personal-number-input"
      />
    </div>

    <!-- website -->
    <div class="form-group">
      <TextInput
        v-model="form.personal_webpage"
        :label="$t('profile.edit.general.personal-webpage.label')"
        :placeholder="$t('profile.edit.general.personal-webpage.placeholder')"
        data-test="personal-webpage-input"
        @blur="v$.form.personal_webpage.$validate"
      />
      <FieldErrors :errors="v$.form.personal_webpage.$errors" />
    </div>

    <!-- linkedin -->
    <div class="form-group">
      <TextInput
        v-model="form.linkedin"
        :label="$t('profile.edit.general.linkedin.label')"
        :placeholder="$t('profile.edit.general.linkedin.placeholder')"
        data-test="linkedin-input"
        @blur="v$.form.linkedin.$validate"
      />
      <FieldErrors :errors="v$.form.linkedin.$errors" />
    </div>

    <!-- twitter -->
    <!--div class="form-group">
            <TextInput
                v-model="form.twitter"
                :label="$t('profile.edit.general.twitter.label')"
                :placeholder="$t('profile.edit.general.twitter.placeholder')"
                @blur="v$.form.twitter.$validate"
                data-test="twitter-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.twitter.$errors" />
        </div-->

    <hr class="form-separator" />

    <!-- Picture -->
    <div class="form-group img-ctn">
      <label>{{ $t('profile.edit.general.picture.label') }}</label>
      <ImageEditor
        v-model:image-sizes="form.imageSizes"
        v-model:picture="form.picture"
        :picture-alt="`${form.last_name} image`"
        :contain="true"
        :round-picture="true"
        :default-picture="`${runtimeConfig.public.appPublicBinariesPrefix}/patatoids-project/Patatoid-1.png`"
      />
    </div>

    <hr class="form-separator" />

    <!-- job title -->
    <div class="form-group">
      <TextInput
        v-model="form.title"
        :label="$t('profile.edit.general.title.label')"
        :placeholder="$t('profile.edit.general.title.placeholder')"
        data-test="title-input"
        @blur="v$.form.title.$validate"
      />
      <FieldErrors :errors="v$.form.title.$errors" />
    </div>

    <!-- org address -->
    <div class="form-group">
      <TextInput
        v-model="form.location"
        :label="$t('profile.edit.general.organization-address.label')"
        :placeholder="$t('profile.edit.general.organization-address.placeholder')"
        input-type="textarea"
        data-test="location-input"
      />
    </div>

    <hr class="form-separator" />

    <!-- SDGs -->
    <div class="form-group">
      <div class="label-wrapper">
        <label>
          {{ $t('profile.edit.general.sdgs.label') }} ({{ form.sdgs ? form.sdgs.length : '0' }})
        </label>

        <LpiButton
          :label="$t('profile.edit.general.sdgs.add')"
          btn-icon="Plus"
          data-test="sdg-add"
          @click="openSdgsDrawer"
        />
      </div>
      <p class="notice">
        {{ $t('profile.edit.general.sdgs.notice-start') }}
        <a :href="$t('profile.edit.general.sdgs.link')" target="_blank" class="link">
          {{ $t('profile.edit.general.sdgs.notice-link') }}
        </a>
        {{ $t('profile.edit.general.sdgs.notice-end') }}
      </p>
      <TransitionGroup v-if="form.sdgs && form.sdgs.length" tag="div" name="sdg" class="sdgs-list">
        <img
          v-for="sdg in form.sdgs"
          :key="sdg"
          :alt="sdg"
          :src="`${runtimeConfig.public.appPublicBinariesPrefix}/sdgs/logo/SDG-${sdg}.svg`"
          class="sdg-picture"
        />
      </TransitionGroup>
    </div>

    <hr class="form-separator" />
    <p v-if="v$.$errors.length" class="error-message">
      {{ $t('profile.edit.general.form-has-error') }}
    </p>
    <!-- actions -->
    <div class="form-actions" data-test="main-form">
      <LpiButton
        :disabled="asyncing"
        :label="$t('common.cancel')"
        :secondary="true"
        class="footer__left-button"
        data-test="close-button"
        @click="redirectToProfile"
      />

      <LpiButton
        :disabled="v$.$errors.length || asyncing"
        :label="$t('common.confirm')"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        class="footer__right-button"
        data-test="confirm-button"
        @click="save"
      />
    </div>
  </div>
  <!-- sdgs selector -->
  <BaseDrawer
    :confirm-action-name="$t('common.confirm')"
    :is-opened="showSdgsDrawer"
    :title="$t('profile.edit.general.sdgs.label')"
    class="medium"
    data-test="sdgs-drawer"
    @close="showSdgsDrawer = false"
    @confirm="selectSdgs"
  >
    <SdgsFilter v-if="showSdgsDrawer" v-model="sdgsSelection" />
  </BaseDrawer>

  <!--ConfirmModal
    v-if="showCancelConfirmModal"
    :content="$t('profile.cancel-content')"
    :title="$t('profile.cancel-title')"
    :cancel-button-label="$t('common.no')"
    :confirm-button-label="$t('common.yes')"
    @cancel="showCancelConfirmModal = false"
    @confirm="resetAndLeaveEditPage"
  /-->
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, url } from '@vuelidate/validators'
import { patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import { isEqual } from 'es-toolkit'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import { VALID_NAME_REGEX } from '@/functs/constants.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'

function defaultForm() {
  return {
    pronouns: '',
    first_name: '',
    last_name: '',
    professional_email: '',
    professional_number: '',
    personal_number: '',
    personal_webpage: '',
    linkedin: '',
    twitter: '',
    picture: '',
    imageSizes: null,
    title: '',
    location: '',
    tags: [],
    sdgs: [],
  }
}

export default {
  name: 'ProfileGeneralEditTab',

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  emits: ['profile-edited'],

  setup() {
    const toaster = useToasterStore()
    const usersStore = useUsersStore()
    const runtimeConfig = useRuntimeConfig()
    const form = ref(defaultForm())
    const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)
    return {
      toaster,
      usersStore,
      runtimeConfig,
      startEditWatcher,
      stopEditWatcher,
      form,
    }
  },
  data() {
    return {
      asyncing: false,
      tagsSelection: [],
      showSdgsDrawer: false,
      sdgsSelection: [],
      v$: useVuelidate(),
      // showCancelConfirmModal: false,
    }
  },

  validations() {
    return {
      form: {
        first_name: {
          required: helpers.withMessage(
            this.$t('profile.edit.general.first-name.is-required'),
            required
          ),
          alphanum: helpers.withMessage(
            this.$t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        last_name: {
          required: helpers.withMessage(
            this.$t('profile.edit.general.last-name.is-required'),
            required
          ),
          alphanum: helpers.withMessage(
            this.$t('profile.edit.general.no-special-characters'),
            helpers.regex(VALID_NAME_REGEX)
          ),
        },
        professional_email: {
          required: helpers.withMessage(
            this.$t('profile.edit.general.professional-email.is-required'),
            required
          ),
          email: helpers.withMessage(
            this.$t('profile.edit.general.professional-email.is-email'),
            email
          ),
        },
        title: {
          required: helpers.withMessage(
            this.$t('profile.edit.general.title.is-required'),
            required
          ),
        },
        personal_webpage: {
          url: helpers.withMessage(this.$t('profile.edit.general.personal-webpage.is-url'), url),
        },
        linkedin: {
          url: helpers.withMessage(this.$t('profile.edit.general.linkedin.is-url'), url),
        },
        // twitter: {
        //   url: helpers.withMessage(this.$t('profile.edit.general.twitter.is-url'), url),
        // },
      },
    }
  },

  computed: {
    // hasFormChanged() {
    //   return this.v$.$anyDirty
    // },
    isSelf() {
      const connectedUser = this.usersStore.userFromApi
      return connectedUser && this.user.id === connectedUser.id
    },
  },

  watch: {
    user: {
      handler(neo) {
        if (neo) this.resetForm()
      },
      immediate: true,
    },
  },

  methods: {
    // cancel() {
    //   if (this.hasFormChanged) {
    //     this.showCancelConfirmModal = true
    //   } else {
    //     this.resetAndLeaveEditPage()
    //   }
    // },

    // resetAndLeaveEditPage() {
    //   this.resetForm()
    //   this.redirectToProfile()
    // },

    async save() {
      this.asyncing = true
      const isValid = await this.v$.$validate()
      try {
        if (isValid) {
          const data = {
            pronouns: this.form.pronouns,
            given_name: this.form.first_name,
            family_name: this.form.last_name,
            email: this.form.professional_email,
            landline_phone: this.form.professional_number,
            mobile_phone: this.form.personal_number,
            website: this.form.personal_webpage,
            linkedin: this.form.linkedin,
            twitter: this.form.twitter,
            job: this.form.title,
            location: this.form.location,
            sdgs: this.form.sdgs,
            // TODO: tags ???
            // TODO: "facebook": "string",
            // TODO: "medium": "string",
            // TODO: "skype": "string",
          }

          await patchUser(this.user.id, data)

          // patch user picture if changed

          if (
            this.form.picture != this.user.profile_picture?.url ||
            !isEqual(this.form.imageSizes, pictureApiToImageSizes(this.user.profile_picture))
          ) {
            const formData = new FormData()
            imageSizesFormData(formData, this.form.imageSizes)

            if (this.form.picture instanceof File) {
              formData.append('file', this.form.picture, this.form.picture.name)
              const picture_id = (await postUserPicture(this.user.id, formData)).id

              // TODO: make this in POST when backend allows it
              formData.delete('file')
              await patchUserPicture(this.user.id, picture_id, formData)
            } else if (this.user.profile_picture && this.user.profile_picture.id) {
              await patchUserPicture(this.user.id, this.user.profile_picture.id, formData)
            }
          }

          this.$emit('profile-edited')

          this.startEditWatcher()

          // give extra time for profile-edited event to be consumed
          await new Promise((resolve) => setTimeout(resolve, 50))
          // reload user if self to update store info
          if (this.isSelf) this.usersStore.getUser(this.user.id)
          // confirm success
          this.toaster.pushSuccess(this.$t('profile.edit.general.save-success'))
        }
      } catch (error) {
        this.toaster.pushError(`${this.$t('profile.edit.general.save-error')} (${error})`)
        console.error(error)
      } finally {
        this.asyncing = false
        if (isValid) {
          this.redirectToProfile()
        }
      }
    },

    redirectToProfile() {
      if (this.isSelf) this.$router.push({ name: 'Profile' })
      else
        this.$router.push({
          name: 'ProfileOtherUser',
          params: { userId: this.user.id },
        })
    },

    async resetForm() {
      this.stopEditWatcher()
      if (this.user) {
        this.form = {
          pronouns: this.user.pronouns || '',
          first_name: this.user.given_name,
          last_name: this.user.family_name,
          professional_email: this.user.email,
          professional_number: this.user.landline_phone || '',
          personal_number: this.user.mobile_phone || '',
          personal_webpage: this.user.website || '',
          linkedin: this.user.linkedin || '',
          twitter: this.user.twitter || '',
          imageSizes: pictureApiToImageSizes(this.user.profile_picture),

          title: this.user.job || '',
          location: this.user.location || '',
          tags: [], // TODO
          sdgs: this.user.sdgs || [],
          picture: this.user.profile_picture,
        }
      } else {
        this.form = defaultForm()
      }
      this.startEditWatcher()
    },

    openSdgsDrawer() {
      this.sdgsSelection = [...this.form.sdgs]
      this.showSdgsDrawer = true
    },

    selectSdgs() {
      this.form.sdgs = [...this.sdgsSelection]
      this.showSdgsDrawer = false
    },
  },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.img-ctn {
  margin-bottom: $space-xl;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    align-self: flex-start;
  }
}

$sdg-size: $layout-size-4xl;

.tags-list,
.sdgs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax($sdg-size, 1fr));
  gap: $space-m;
  margin-top: $space-m;
}

.sdg-picture {
  display: inline-block;
  width: $sdg-size;
  height: $sdg-size;
}

.sdg-enter-active,
.sdg-leave-active {
  transition: all 0.4s ease;
}

.sdg-enter-from,
.sdg-leave-to {
  transform: scale(0) translateY(200%);
}

.form-actions {
  position: sticky;
  bottom: 0;
  background-color: white;
}

.link {
  display: inline-flex;
  font-weight: bold;
  text-decoration: underline;
  color: $primary-dark;
  cursor: pointer;
}
</style>
