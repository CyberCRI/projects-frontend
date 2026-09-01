<template>
  <div class="profile-edit-privacy" :class="{ frozen: asyncing }">
    <PrivacyField
      v-for="field in fields"
      :key="field.modelKey"
      v-model="form[field.modelKey]"
      :label="field.label"
      :notice="field.notice"
      :has-icon="field.hasIcon"
      :options="field.options"
      @update:model-value="save"
    />
    <LoaderSimple v-if="isLoading || asyncing" class="loader" />
  </div>
</template>
<script lang="ts" setup>
import type { PrivacySettings, PrivacyValue } from 'shared-projects-frontend/models'
import type { GroupOption } from '~/components/base/button/GroupButton.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import { patchUserPrivacy } from 'shared-projects-frontend/apis'
import { getUserPrivacy } from '~/api/v2/user.service.ts'
import useToasterStore from '~/stores/useToaster'

function defaultForm(): PrivacySettings {
  return {
    publication_status: 'pub',
    profile_picture: 'org',
    email: 'hide',
    mobile_phone: 'hide',
    skills: 'hide',
    socials: 'org',
  }
}

function dataMapping() {
  return {
    publication_status: ['publication_status'],
    profile_picture: ['profile_picture'],
    email: ['email'],
    mobile_phone: ['mobile_phone'],
    skills: ['skills'],
    socials: ['socials'],
  }
}

const props = defineProps<{
  user: TranslatedUserModel
}>()

const emit = defineEmits(['update:modelValue', 'profile-edited'])

const toaster = useToasterStore()
// const usersStore = useUsersStore()
const { t } = useI18n()
const form = ref(defaultForm())
const asyncing = ref(false)
// isSelf() {
//   if (!this.user) return true
//   const connectedUser = this.usersStore.userFromApi
//   return connectedUser && this.user?.id === connectedUser?.id
// },
const optionsMap = computed(() => ({
  hide: {
    label: t('profile.edit.privacy.options.hide'),
    iconName: 'EyeSlash',
    value: 'hide',
    // @ts-expect-error
    rank: 0,
  },
  org: {
    label: t('profile.edit.privacy.options.org'),
    iconName: 'PeopleGroup',
    value: 'org',
    // @ts-expect-error
    rank: 1,
  },
  pub: {
    label: t('profile.edit.privacy.options.pub'),
    iconName: 'Eye',
    value: 'pub',
    // @ts-expect-error
    rank: 2,
  },
  // } satisfies { [key in PrivacyValue]: GroupOption }
}))

const settingsList = computed(() =>
  Object.values(optionsMap.value)
    .sort((a, b) => a.rank - b.rank)
    .map((option) => option.value)
)

const groupOptions = computed(() => ({
  profile_picture: [optionsMap.value.org, optionsMap.value.pub],
  email: [optionsMap.value.hide, optionsMap.value.org, optionsMap.value.pub],
  mobile_phone: [optionsMap.value.hide, optionsMap.value.org, optionsMap.value.pub],
  skills: [optionsMap.value.hide, optionsMap.value.org, optionsMap.value.pub],
  socials: [optionsMap.value.org, optionsMap.value.pub],
  publication_status: [optionsMap.value.hide, optionsMap.value.org, optionsMap.value.pub],
}))

const fields = computed(() => [
  {
    label: t('profile.edit.privacy.publication-status.label'),
    notice: t('profile.edit.privacy.publication-status.notice'),
    options: groupOptions.value.publication_status,
    hasIcon: true,
    modelKey: 'publication_status',
  },
  // picture
  {
    label: t('profile.edit.privacy.picture.label'),
    notice: t('profile.edit.privacy.picture.notice'),
    options: groupOptions.value.profile_picture,
    hasIcon: true,
    modelKey: 'profile_picture',
  },
  // email
  {
    label: t('profile.edit.privacy.email.label'),
    notice: t('profile.edit.privacy.email.notice'),
    options: groupOptions.value.email,
    hasIcon: true,
    modelKey: 'email',
  },
  // personal phone
  {
    label: t('profile.edit.privacy.personal-phone.label'),
    notice: t('profile.edit.privacy.personal-phone.notice'),
    options: groupOptions.value.mobile_phone,
    hasIcon: true,
    modelKey: 'mobile_phone',
  },
  // skills & hobbie
  {
    label: t('profile.edit.privacy.skills-hobbies.label'),
    notice: t('profile.edit.privacy.skills-hobbies.notice'),
    options: groupOptions.value.skills,
    hasIcon: true,
    modelKey: 'skills',
  },

  // socials
  {
    label: t('profile.edit.privacy.socials.label'),
    notice: t('profile.edit.privacy.socials.notice'),
    options: groupOptions.value.socials,
    hasIcon: true,
    modelKey: 'socials',
  },
])

async function save() {
  asyncing.value = true
  try {
    const apiData = adaptFormToApi()
    await patchUserPrivacy(props.user.id, apiData)

    // TODO refresh
    // if (props.user.id === usersStore.id) usersStore.getUser(props.user.id)
    // else getUser(props.user.id)

    emit('profile-edited')

    toaster.pushSuccess(t('profile.edit.privacy.save-success'))
  } catch (error) {
    toaster.pushError(`${t('profile.edit.privacy.save-error')} (${error})`)
    console.error(error)
  } finally {
    asyncing.value = false
  }
}

const { data: privacySettings, isLoading } = await getUserPrivacy(
  useOrganizationCode(),
  props.user.id,
  {
    immediate: props.user.id != -1,
  }
)

watch(
  () => privacySettings.value,
  (neo) => {
    if (neo) form.value = adaptApiToForm(neo)
  }
)

function adaptFormToApi() {
  const mapping = dataMapping()
  const apiData = {}

  for (const key in mapping) {
    const targets = mapping[key]
    const value = form.value[key]
    targets.forEach((target) => {
      apiData[target] = value
    })
  }
  return apiData
}

function adaptApiToForm(apiSettings) {
  // api is more fine grained than front
  // so we need to adapt it

  const mapping = dataMapping()
  const res = defaultForm()
  for (const key in mapping) {
    const targets = mapping[key]
    const ranks = targets
      .map((apiSetting) => apiSettings[apiSetting])
      .map((settingValue) => optionsMap.value[settingValue].rank)
    const minRank = Math.min(...ranks) // use the most private api setting
    const safeRank = Math.max(minRank, groupOptions.value[key][0].rank) // make sure it's not more private than allowed by the field
    res[key] = settingsList.value[safeRank]
  }
  return res
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';
@use '~/pages/UserProfilePageV2/Tabs/profile-form';

.profile-edit-privacy {
  margin-top: variables.$space-xl;
  position: relative;

  &.frozen {
    pointer-events: none;
    opacity: 0.6;
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
