<template>
  <div v-if="isLoading" class="loader">
    <LpiLoader type="simple" />
  </div>
  <div class="account-layout">
    <AccountFormTitleBlock
      :main-title-label="mainTitleLabel"
      :show-help="isAddMode || isInviteMode"
    />

    <AccountForm
      v-if="currentUser"
      :is-add-mode="isAddMode"
      :is-invite-mode="isInviteMode"
      :selected-user="currentUser"
      @close="emit('close')"
    />
  </div>
</template>

<script setup>
import { getUser } from '@/api/people.service.ts'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'
import AccountForm from '@/components/people/Account/AccountForm.vue'

defineOptions({ name: 'AccountLayout' })

const props = defineProps({
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
})

const emit = defineEmits(['close'])

const currentUser = ref(null)
const isLoading = ref(true)
const { t } = useNuxtI18n()

const mainTitleLabel = computed(() => {
  return props.isAddMode
    ? t('account.title-create')
    : props.isInviteMode
      ? t('account.title-invite')
      : t('account.title-edit')
})

const setFormFromSelectedUser = async () => {
  const user = await getUser(props.selectedUser.id)
  currentUser.value = {
    ...user,
    current_org_role: props.selectedUser.current_org_role,
  }
}

onMounted(async () => {
  if (props.selectedUser?.id) await setFormFromSelectedUser()
  else
    currentUser.value = {
      ...props.selectedUser,
      current_org_role: props.selectedUser?.current_org_role,
    }
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  margin: auto;
  width: 100vw;
  height: 100vh;
  top: 50%;
  left: 50%;
  display: flex;
  background-color: rgb(255 255 255 / 80%);
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.account-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;
  width: pxToRem(500px);
}
</style>
