<template>
  <div v-if="loading" class="loader">
    <LoaderSimple />
  </div>
  <template v-else>
    <ProfileEditBlock :block-title="t('complete-profile.skills.title')">
      <ProfileSkillsEditTab v-if="user" :user="user" @edited="loadUser" />
    </ProfileEditBlock>
  </template>
</template>

<script setup>
import ProfileEditBlock from '@/components/people/CompleteProfileDrawer/ProfileEditBlock.vue'
import ProfileSkillsEditTab from '@/pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'
import { getUser } from '@/api/people.service.ts'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useUsersStore from '@/stores/useUsers.ts'

defineOptions({ name: 'CompleteProfileStep2' })
const emit = defineEmits(['saving', 'loading'])

const { t } = useNuxtI18n()
const usersStore = useUsersStore()
const { onboardingTrap } = useOnboardingStatus()

const user = ref(null)
const loading = ref(false)

const loadUser = async () => {
  try {
    user.value = await getUser(usersStore.id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  loading.value = true
  emit('loading', true)

  try {
    await loadUser()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
})

const save = async () => {
  // this called by CompleteProfileDrawer.vue
  await onboardingTrap('complete_profile', false)
  return true
}

defineExpose({ save })
</script>
<style lang="scss" scoped>
.loader {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
