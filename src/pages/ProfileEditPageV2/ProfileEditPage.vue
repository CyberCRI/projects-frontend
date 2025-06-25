<script setup>
import { getUser } from '@/api/people.service.ts'
import useUsersStore from '@/stores/useUsers.ts'
import ProfileEditTabs from './Tabs/ProfileEditTabs.vue'
import { getOrganizationByCode } from '@/api/organizations.service'

const usersStore = useUsersStore()
const { t } = useI18n()

const { onboardingTrap } = useOnboardingStatus()

const props = defineProps({
  userId: {
    type: [String, Number, null],
    required: false,
    default: null,
  },
})

const user = ref(null)

const isSelf = computed(() => {
  // safe check for isSelf beacuse this.userId might be a slug in fact
  return usersStore.userFromApi && user.value?.id === usersStore.userFromApi.id
})
const username = computed(() => {
  return user.value ? user.value.given_name + ' ' + user.value.family_name : ''
})

const loadUser = async () => {
  try {
    user.value = await getUser(props.userId || usersStore.id)
  } catch (error) {
    console.error(error)
  }
}

const onProfileEdited = async () => {
  if (user.value?.id == usersStore.id) {
    onboardingTrap('complete_profile', false)
  }
}

provide('profileEditReloadUser', loadUser)

onMounted(async () => {
  await loadUser()
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() =>
      !user.value
        ? undefined
        : isSelf.value
          ? t('profile.edit.edit-my-profile')
          : t('profile.edit.edit-other-profile', { name: username.value })
    ),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>

<template>
  <div>
    <div class="my-profile-edit page-section-wide">
      <h1 v-if="user && isSelf" class="title">
        {{ $t('profile.edit.edit-my-profile') }}
      </h1>
      <h1 v-else-if="user" class="title">
        {{ $t('profile.edit.edit-other-profile', { name: username }) }}
      </h1>
      <p class="notice">
        {{ $t('profile.edit.notice') }}
        <NuxtLink :to="{ name: 'Help' }">
          {{ $t('profile.edit.help') }}
        </NuxtLink>
      </p>
      <div class="body">
        <ProfileEditTabs
          v-if="user"
          :user="user"
          :is-self="isSelf"
          @profile-edited="onProfileEdited"
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.my-profile-edit {
  margin-top: $navbar-height;
}

.title,
.notice {
  text-align: center;
}

.title {
  padding-top: pxToRem(88px);
  font-size: $font-size-5xl;
}

.notice {
  padding-top: $layout-size-3xl;

  a {
    color: $primary-dark;
    font-weight: 700;
  }
}

.body {
  padding-top: $layout-size-7xl;
  padding-bottom: $space-2xl;
}
</style>
