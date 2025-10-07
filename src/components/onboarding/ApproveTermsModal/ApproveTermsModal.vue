<script setup>
// import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'

const isOpen = ref(true)

const organizationsStore = useOrganizations()

const currentOrganization = computed(() => organizationsStore.current)

const hasReadAll = ref(false)

const onTosScroll = (e) => {
  const scrollable = e.target
  if (scrollable.scrollTop === scrollable.scrollTopMax) {
    // reached bottom
    hasReadAll.value = true
  }
}
</script>
<template>
  <BaseModal
    v-if="isOpen"
    modal-id="approve-terms-modal"
    :width="width"
    :height="height"
    :is-small="isSmall"
    @content-scroll="onTosScroll"
  >
    <template #header-title>Approve Terms and Conditions</template>
    <template #content>
      <p>
        Please read and approve the updated Terms and Conditions to continue using the platform.
      </p>
      <div class="tos-content">
        <TipTapOutput
          v-if="currentOrganization?.hasTerms"
          :content="currentOrganization?.termsContent"
        />
        <DefaultTermsOfService v-else />
      </div>
    </template>
    <template #footer>
      <LpiButton
        :disabled="asyncing || !hasReadAll"
        :label="$t('common.yes')"
        data-test="approve-terms"
        :btn-icon="asyncing ? 'LoaderSimple' : null"
        @click="approveTerms"
      />
    </template>
  </BaseModal>
</template>
