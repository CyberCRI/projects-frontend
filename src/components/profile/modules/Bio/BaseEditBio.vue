<script setup lang="ts">
import type { TranslatedUserModel, UserSlugOrId } from 'shared-projects-frontend/models'
import { useProfileFormBio, defaultProfileFormBio } from '~/form/profile'
import { refreshUserData } from '~/composables/user/refreshUser'
import { patchUser } from 'shared-projects-frontend/apis'
import FormPanel from '~/components/base/FormPanel.vue'
import { getFirstTextNotEmpty } from '~/functs/tiptap'
import useToasterStore from '~/stores/useToaster'
import { formEqual } from '~/form/base'

const props = withDefaults(
  defineProps<{
    user: TranslatedUserModel
  }>(),
  {}
)

const router = useRouter()
const { t } = useNuxtI18n()

const { stateModals, openModals, closeAllModals, closeModals } = useModals({
  saveChange: false,
})
const toaster = useToasterStore()

const asyncing = ref(false)
const defaultLocalForm = () => {
  const f = defaultProfileFormBio()
  f.description = getFirstTextNotEmpty([props.user.description]) || f.short_description
  f.short_description = getFirstTextNotEmpty([props.user.short_description]) || f.short_description

  return f
}

const { form, errors, isValid } = useProfileFormBio({
  default: defaultLocalForm(),
})

const isEqual = useBlockNavigation(() =>
  formEqual(form.value, defaultLocalForm(), { html: ['description'] })
)

const clear = () => {
  closeAllModals()
  asyncing.value = false
}

const redirect = (userIdOrSlug: UserSlugOrId = null) => {
  router.push({
    name: 'ProfileBio',
    params: { userIdOrSlug: userIdOrSlug || props.user.slug || props.user.id },
  })
}

const close = () => {
  clear()
  redirect()
}

const onConfirm = () => {
  patchUser(props.user.id, form.value)
    .then((newUser) => {
      toaster.pushSuccess(t('profile.edit.bio.save-success'))
      return refreshUserData(props.user).then(() => {
        clear()
        redirect(newUser.slug || newUser.id)
      })
    })
    .catch((error) => {
      toaster.pushError(t('profile.edit.bio.save-error'))
      console.error(error)
    })
    .finally(() => {
      clear()
    })
}

const checkClose = () => {
  if (isEqual.value) {
    redirect()
  } else {
    openModals('saveChange')
  }
}
</script>

<template>
  <FormPanel
    :asyncing="asyncing"
    :confirm-action-disabled="isEqual || !isValid"
    @close="checkClose"
    @confirm="onConfirm"
  >
    <div class="list-container">
      <TextInput
        v-model="form.short_description"
        :label="$t('profile.edit.bio.short-bio.label')"
        :placeholder="$t('profile.edit.bio.short-bio.placeholder')"
        :max-length="300"
        data-test="short-bio-input"
        class="skeletons-background"
      />

      <Field :label="$t('profile.edit.bio.long-bio.label')" required class="editor-section">
        <TipTapEditor
          ref="tiptapEditor"
          v-model="form.description"
          class="input-field content-editor w-full skeletons-background"
          :errors="errors.description"
        />
      </Field>
    </div>

    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close()"
    />
  </FormPanel>
</template>
