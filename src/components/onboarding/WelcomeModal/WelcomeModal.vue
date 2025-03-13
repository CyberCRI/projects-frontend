<template>
  <BaseModal data-test="welcome-modal" @close="completeLater">
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
          :disabled="!!asyncing"
          :label="$t('welcome-modal.complete-later')"
          :btn-icon="asyncing == 'skip' ? 'LoaderSimple' : undefined"
          :secondary="true"
          class="footer__left-button"
          data-test="close-button"
          @click="completeLater"
        />

        <LpiButton
          :disabled="!!asyncing"
          :label="$t('welcome-modal.complete-now')"
          :btn-icon="asyncing == 'proceed' ? 'LoaderSimple' : undefined"
          :secondary="false"
          class="footer__right-button"
          data-test="confirm-button"
          @click="completeNow"
        />
      </div>
    </template>
  </BaseModal>
</template>
<script>
import BaseModal from '@/components/base/modal/BaseModal.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'WelcomeModal',

  components: { BaseModal, LpiButton },

  emits: ['close', 'complete-profile'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    const { onboardingTrapAll } = useOnboardingStatus()
    return {
      organizationsStore,
      onboardingTrapAll,
    }
  },

  data() {
    return {
      asyncing: false,
    }
  },

  computed: {
    organizationLogo() {
      return this.organizationsStore.current?.logo_image?.variations?.medium
    },
    organizationTitle() {
      return this.organizationsStore.current?.name || ''
    },
  },

  methods: {
    async completeLater() {
      await this.patchUser('skip')
      this.$emit('close')
    },

    async completeNow() {
      await this.patchUser('proceed')
      this.$emit('complete-profile')
    },

    async patchUser(choice) {
      this.asyncing = choice
      // register that the user has seen the welcome modal
      // and set the next todos
      await this.onboardingTrapAll({
        show_welcome: false,
        // use 1 for step insted of 0 to have a truthy value
        show_complete_profile_modal: choice == 'proceed' ? 1 : false,
        show_progress: true,
        complete_profile: true,
        explore_projects: true,
        create_project: true,
        take_tour: true,
      })

      this.asyncing = false
    },
  },
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
