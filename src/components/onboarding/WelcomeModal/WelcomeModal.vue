<template>
  <BaseModal modal-data-test="welcome-modal" @close="completeLater">
    <template #content>
      <div class="portal-logo-ctn" :style="{ 'background-image': `url(${organizationLogo})` }" />
      <i18n-t keypath="welcome-modal.title" tag="h2" class="welcome-title" scope="global">
        <span>{{ organizationTitle }}</span>
      </i18n-t>
      <p class="notice">
        {{ $t('welcome-modal.success') }}
      </p>
      <p class="notice">
        {{ $t('welcome-modal.instruction') }}
      </p>
      <p class="notice">
        {{ $t('welcome-modal.guidance') }}
      </p>
    </template>
    <template #footer>
      <div class="footer">
        <LpiButton
          :disabled="!!status"
          :label="$t('welcome-modal.complete-later')"
          :btn-icon="status == 'skip' ? 'LoaderSimple' : undefined"
          :secondary="true"
          class="footer__left-button"
          data-test="close-button"
          @click="completeLater"
        />

        <LpiButton
          :disabled="!!status"
          :label="$t('welcome-modal.complete-now')"
          :btn-icon="status == 'proceed' ? 'LoaderSimple' : undefined"
          :secondary="false"
          class="footer__right-button"
          data-test="confirm-button"
          @click="completeNow"
        />
      </div>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations'

const emit = defineEmits<{
  close: []
  'complete-profile': []
}>()
const organizationsStore = useOrganizationsStore()
const { onboardingTrapAll } = useOnboardingStatus()
const status = ref<'proceed' | 'skip' | ''>('')

const organizationLogo = computed(() => {
  return organizationsStore.current?.logo_image?.variations?.medium
})
const organizationTitle = computed(() => {
  return organizationsStore.current?.name || ''
})

const completeLater = async () => {
  await patchUser('skip')
  emit('close')
}

const completeNow = async () => {
  await patchUser('proceed')
  emit('complete-profile')
}

const patchUser = async (choice) => {
  status.value = choice
  // register that the user has seen the welcome modal
  // and set the next todos
  await onboardingTrapAll({
    show_welcome: false,
    // use 1 for step insted of 0 to have a truthy value
    show_complete_profile_modal: choice == 'proceed' ? 1 : false,
    show_progress: true,
    complete_profile: true,
    explore_projects: true,
    create_project: true,
    take_tour: true,
  })

  status.value = ''
}
</script>
<style scoped lang="scss">
.portal-logo-ctn {
  width: 16rem;
  height: 16rem;
  margin: 0 auto;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.welcome-title {
  text-align: center;
  font-weight: 700;
  font-size: $font-size-3xl;
  line-height: $line-height-tight;
  margin-bottom: pxToRem(56px);
}

.notice {
  font-size: $font-size-m;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: $space-l;
}
</style>
