<template>
  <BaseModal data-test="profile-completed-modal" @close="skip">
    <template #content>
      <div class="portal-logo-ctn" :style="{ 'background-image': `url(${organizationLogo})` }" />
      <h2 class="welcome-title">
        {{ $t('profile-completed-modal.title') }}
      </h2>
      <p class="notice">
        {{ $t('profile-completed-modal.notice-congratulation') }}
      </p>
      <p class="notice">
        {{ $t('profile-completed-modal.notice-tour') }}
      </p>
    </template>
    <template #footer>
      <div class="footer">
        <LpiButton
          :label="$t('profile-completed-modal.skip')"
          :secondary="true"
          :disabled="asyncing"
          :btn-icon="asyncing == 'skip' ? 'LoaderSimple' : undefined"
          class="footer__left-button"
          data-test="close-button"
          @click="skip"
        />

        <LpiButton
          :disabled="asyncing"
          :label="$t('profile-completed-modal.take-tour')"
          :btn-icon="asyncing == 'proceed' ? 'LoaderSimple' : undefined"
          :secondary="false"
          class="footer__right-button"
          data-test="confirm-button"
          @click="takeTour"
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
  name: 'ProfileCompletedModal',

  components: { BaseModal, LpiButton },

  emits: ['close', 'take-tour'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
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
  },

  methods: {
    async skip() {
      this.$emit('close')
    },

    async takeTour() {
      this.$emit('take-tour')
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
