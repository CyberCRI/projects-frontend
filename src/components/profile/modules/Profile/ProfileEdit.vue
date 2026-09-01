<script setup lang="ts">
import {
  patchUser,
  patchUserPicture,
  postUserPicture,
  deleteUserPicture,
} from 'shared-projects-frontend/apis'

import SdgList from '~/components/sdgs/SdgList.vue'

import useToasterStore from '~/stores/useToaster'

import type { TranslatedUserModel, UserModel, UserSlugOrId } from 'shared-projects-frontend/models'
import { imageSizesFormData, pictureApiToImageSizes } from '~/functs/imageSizesUtils'
import { formEqual, imageAdded, imageDeleted, imageUpdated } from '~/form/base'
import { defaultProfileForm, useProfileForm } from '~/form/profile'
import { refreshUserData } from '~/composables/user/refreshUser'
import FormPanel from '~/components/base/FormPanel.vue'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const router = useRouter()
const toaster = useToasterStore()
const { t } = useNuxtI18n()
const asyncing = ref(false)

const defaultLocalForm = () => {
  const localForm = defaultProfileForm()

  localForm.sdgs = props.user.sdgs || localForm.sdgs
  localForm.email = props.user.email || localForm.email
  localForm.family_name = props.user.family_name || localForm.family_name
  localForm.given_name = props.user.given_name || localForm.given_name
  localForm.job = props.user.job || localForm.job
  localForm.profile_picture = props.user.profile_picture || localForm.profile_picture
  localForm.imageSizes = pictureApiToImageSizes(props.user.profile_picture || localForm.imageSizes)

  localForm.website = props.user.website || localForm.website
  localForm.landline_phone = props.user.landline_phone || localForm.landline_phone
  localForm.mobile_phone = props.user.mobile_phone || localForm.mobile_phone
  localForm.linkedin = props.user.linkedin || localForm.linkedin
  localForm.location = props.user.location || localForm.location
  localForm.skype = props.user.skype || localForm.skype
  localForm.facebook = props.user.facebook || localForm.facebook

  return localForm
}

const { form, errors, isValid, reset } = useProfileForm({
  default: defaultLocalForm(),
})

watch(
  () => props.user,
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

const isEqual = useBlockNavigation(() => formEqual(form.value, defaultLocalForm()))

const { stateModals, closeAllModals, openModals, closeModals } = useModals({
  saveChange: false,
  sdgs: false,
})

const redirect = (userSlugOrId: UserSlugOrId = null) => {
  router.push({
    name: 'ProfileUser',
    params: { userIdOrSlug: userSlugOrId || props.user.slug || props.user.id },
  })
}
const clear = () => {
  closeAllModals()
  asyncing.value = false
}

const close = () => {
  clear()
  redirect()
}

const checkProfilePicture = async (newUser: UserModel) => {
  let pictureId = newUser.profile_picture?.id

  if (
    imageDeleted(
      { picture: form.value.profile_picture, imageSizes: form.value.imageSizes },
      newUser.profile_picture
    )
  ) {
    await deleteUserPicture(props.user.id, newUser.profile_picture.id)
  }

  if (
    imageAdded(
      { picture: form.value.profile_picture, imageSizes: form.value.imageSizes },
      newUser.profile_picture
    )
  ) {
    const file = form.value.profile_picture as File
    const body = new FormData()
    imageSizesFormData(body, form.value.imageSizes)
    body.append('file', file, file.name)

    pictureId = (await postUserPicture(props.user.id, body)).id
  }

  if (
    imageUpdated(
      { picture: form.value.profile_picture, imageSizes: form.value.imageSizes },
      newUser.profile_picture
    )
  ) {
    const body = new FormData()
    imageSizesFormData(body, form.value.imageSizes)

    await patchUserPicture(props.user.id, pictureId, body)
  }
  return newUser
}

const onConfirm = () => {
  asyncing.value = true
  return patchUser(props.user.id, form.value)
    .then((newUser) => {
      return checkProfilePicture(newUser)
    })
    .then((newUser) => {
      return refreshUserData(newUser).then(() => {
        toaster.pushSuccess(t('profile.edit.general.save-success'))
        close()
      })
    })
    .catch((error) => {
      toaster.pushError(t('profile.edit.general.save-error'))
      console.error(error)
    })
    .finally(() => {
      clear()
    })
}

const checkClose = () => {
  if (isEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}
</script>

<template>
  <FormPanel
    :asyncing="asyncing"
    :confirm-action-disabled="isEqual || !isValid"
    @confirm="onConfirm"
    @close="checkClose"
  >
    <div class="list-container">
      <!-- first name -->
      <TextInput
        v-model="form.given_name"
        :label="$t('profile.edit.general.first-name.label')"
        :placeholder="$t('profile.edit.general.first-name.placeholder')"
        data-test="first-name-input"
        :errors="errors.given_name"
      />
      <TextInput
        v-model="form.family_name"
        :label="$t('profile.edit.general.last-name.label')"
        :placeholder="$t('profile.edit.general.last-name.placeholder')"
        data-test="last-name-input"
        :errors="errors.family_name"
      />
      <!-- pronouns -->
      <TextInput
        v-model="form.pronouns"
        :placeholder="$t('profile.edit.general.pronouns.placeholder')"
        data-test="pronouns-input"
        :label="$t('profile.edit.general.pronouns.label')"
        :help="$t('profile.edit.general.pronouns.notice')"
        :errors="errors.pronouns"
      />

      <!-- pro email -->
      <TextInput
        v-model="form.email"
        :label="$t('profile.edit.general.professional-email.label')"
        :placeholder="$t('profile.edit.general.professional-email.placeholder')"
        :disabled="true"
        input-type="email"
        :errors="errors.email"
      />

      <!-- pro number -->
      <TextInput
        v-model="form.landline_phone"
        :label="$t('profile.edit.general.professional-number.label')"
        :placeholder="$t('profile.edit.general.professional-number.placeholder')"
        data-test="professional-number-input"
        :errors="errors.landline_phone"
      />

      <!-- personal number -->
      <TextInput
        v-model="form.mobile_phone"
        :label="$t('profile.edit.general.personal-number.label')"
        :placeholder="$t('profile.edit.general.personal-number.placeholder')"
        data-test="personal-number-input"
        :errors="errors.mobile_phone"
      />

      <!-- website -->
      <TextInput
        v-model="form.website"
        :label="$t('profile.edit.general.personal-webpage.label')"
        :placeholder="$t('profile.edit.general.personal-webpage.placeholder')"
        data-test="personal-webpage-input"
        :errors="errors.website"
      />

      <!-- linkedin -->
      <TextInput
        v-model="form.linkedin"
        :label="$t('profile.edit.general.linkedin.label')"
        :placeholder="$t('profile.edit.general.linkedin.placeholder')"
        data-test="linkedin-input"
        :errors="errors.linkedin"
      />

      <hr class="form-separator" />

      <!-- Picture -->
      <div class="form-group img-ctn">
        <label class="skeletons-text">{{ $t('profile.edit.general.picture.label') }}</label>
        <ImageEditor
          v-model:image-sizes="form.imageSizes"
          v-model:picture="form.profile_picture"
          :picture-alt="`${form.given_name} image`"
          :contain="true"
          :round-picture="true"
          :default-picture="DEFAULT_USER_PATATOID"
        />
      </div>

      <hr class="form-separator" />

      <!-- job title -->
      <TextInput
        v-model="form.job"
        :label="$t('profile.edit.general.title.label')"
        :placeholder="$t('profile.edit.general.title.placeholder')"
        data-test="title-input"
        :errors="errors.job"
      />

      <!-- org address -->
      <TextInput
        v-model="form.location"
        :label="$t('profile.edit.general.organization-address.label')"
        :placeholder="$t('profile.edit.general.organization-address.placeholder')"
        input-type="textarea"
        data-test="location-input"
        :errors="errors.location"
      />

      <hr class="form-separator" />

      <!-- SDGs -->
      <Field :label="$t('sdg.title')">
        <template #in-label>
          <LpiButton
            class="add-btn skeletons-background"
            :btn-icon="form.sdgs?.length ? 'Pen' : 'Plus'"
            data-test="add-sdgs"
            :label="$t(form.sdgs?.length ? 'group.form.edit' : 'group.form.add')"
            @click="openModals('sdgs')"
          />
        </template>
        <SdgList :sdgs="form.sdgs" />
        <empty-label v-if="form.sdgs.length === 0" :label="$t('sdg.empty')" />
        <SdgsDrawer
          v-model="form.sdgs"
          :is-opened="stateModals.sdgs"
          @close="closeModals('sdgs')"
        />
      </Field>
    </div>

    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />
  </FormPanel>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
@use '~/pages/UserProfilePageV2/Tabs/profile-form';

.img-ctn {
  margin-bottom: variables.$space-xl;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    align-self: flex-start;
  }
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
  color: variables.$primary-dark;
  cursor: pointer;
}
</style>
