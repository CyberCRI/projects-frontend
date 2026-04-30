<template>
  <div class="profile-edit-bio">
    <!-- short bio -->
    <div class="form-group">
      <TextInput
        v-model="form.short_description"
        :label="$t('profile.edit.bio.short-bio.label')"
        :placeholder="$t('profile.edit.bio.short-bio.placeholder')"
        :max-length="300"
        data-test="short-bio-input"
      />
    </div>
    <!-- professional bio -->
    <div class="form-group">
      <label>{{ $t('profile.edit.bio.long-bio.label') }}</label>
      <!--p class="notice">
        {{ $t('profile.edit.bio.professional-bio.placeholder') }}
      </p-->
      <TipTapEditor
        ref="faq-editor"
        :key="user?.id || 'curren-user'"
        v-model="form.description"
        data-test="long-bio-editor"
      />
    </div>
    <!-- actions -->
    <div class="form-actions">
      <LpiButton
        :disabled="asyncing"
        :label="$t('common.cancel')"
        :secondary="true"
        class="footer__left-button"
        data-test="close-button"
        @click="cancel"
      />

      <LpiButton
        :disabled="asyncing"
        :label="$t('common.confirm')"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        :secondary="false"
        class="footer__right-button"
        data-test="confirm-button"
        @click="save"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedUserModel } from '~/models/user.model'
import { patchUser } from '~/api/people.service'
import { defaultFormBio } from '~/form/profile'

import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const emit = defineEmits<{
  'profile-edited': []
}>()
const { t } = useNuxtI18n()
const router = useRouter()
const toaster = useToasterStore()
const usersStore = useUsersStore()
const form = ref(defaultFormBio())
const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)
const asyncing = ref(false)

const isSelf = computed(() => {
  if (!props.user) return true
  const connectedUser = usersStore.userFromApi
  return connectedUser && props.user?.id === connectedUser?.id
})

const resetForm = () => {
  stopEditWatcher()
  form.value = defaultFormBio()
  if (props.user) {
    form.value = {
      short_description: props.user.short_description || form.value.short_description,
      description: props.user.description || form.value.description,
    }
  }
  startEditWatcher()
}

const redirectToProfile = () => {
  if (isSelf.value) {
    router.push({ name: 'ProfileBio' })
  } else {
    router.push({
      name: 'ProfileBioOther',
      params: { userId: props.user.id },
    })
  }
}

const save = async () => {
  asyncing.value = true
  try {
    const data = { ...form.value }

    await patchUser(props.user.id, data)

    startEditWatcher()

    emit('profile-edited')

    // update store if self
    if (isSelf.value) usersStore.getUser(props.user.id)
    toaster.pushSuccess(t('profile.edit.bio.save-success'))
    redirectToProfile()
  } catch (error) {
    toaster.pushError(`${t('profile.edit.bio.save-error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
  }
}

const cancel = () => redirectToProfile()
watch(
  () => props.user,
  (neo) => {
    if (neo) {
      resetForm()
    }
  },
  { immediate: true }
)
</script>
<style scoped lang="scss">
@import './profile-form';

.form-actions {
  position: sticky;
  bottom: 0;
  background-color: white;
}
</style>
