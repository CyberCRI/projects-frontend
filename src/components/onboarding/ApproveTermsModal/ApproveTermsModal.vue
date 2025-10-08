<script setup>
// import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
const organizationsStore = useOrganizations()
const usersStore = useUsersStore()
import { patchUser } from '@/api/people.service'

const lastApprovedVersion = computed(() => {
  if (!usersStore.isConnected) return null
  return usersStore.user?.signed_terms_and_conditions?.version || null
})

const needsAproval = computed(() => {
  if (!usersStore.isConnected) return false
  if (!usersStore.user?.signed_terms_and_conditions?.version) return true
  return organizationsStore.termsVersion > lastApprovedVersion.value
})

const firstnotice = useTemplateRef('firstnotice')
const hasReadAll = ref(false)

const onTosScroll = (e) => {
  const scrollable = e.target
  if (scrollable.scrollTop === scrollable.scrollTopMax) {
    // reached bottom
    hasReadAll.value = true
  }
}

const isAsyncing = ref(false)

watchEffect(() => {
  if (needsAproval.value && firstnotice.value)
    onTosScroll({ target: firstnotice.value?.parentElement })
})

const onTermApproved = async () => {
  if (!usersStore.userFromApi) return
  isAsyncing.value = true
  try {
    const user = usersStore.userFromApi
    const payload = {
      signed_terms_and_conditions: {
        version: organizationsStore.termsVersion,
        date: new Date().toISOString(),
      },
    }
    await patchUser(user.id, payload)
    await usersStore.getUser(user.id)
  } catch (err) {
    console.error(err)
  } finally {
    isAsyncing.value = false
  }
}
</script>
<template>
  <BaseModal
    v-if="needsAproval"
    modal-id="approve-terms-modal"
    :width="width"
    :height="height"
    :is-small="isSmall"
    :can-close="false"
    @content-scroll="onTosScroll"
  >
    <template #header-title>Approve Terms and Conditions</template>
    <template #content>
      <p v-if="lastApprovedVersion" ref="firstnotice" class="notice instructions">
        Our Terms and Conditions have been updated, please take a moment to review and approve them.
      </p>
      <p v-else ref="firstnotice" class="notice instructions">
        Please read and approve the updated Terms and Conditions to continue using the platform.
      </p>
      <div class="tos-content">
        <TipTapOutput
          v-if="organizationsStore?.hasTerms"
          :content="organizationsStore?.termsContent"
        />
        <DefaultTermsOfService v-else />
      </div>
    </template>
    <template #footer>
      <div class="approve-footer">
        <p class="notice" :class="{ transparent: hasReadAll }">
          Go to the bottom of the terms before you can approve.
        </p>
        <div class="action-buttons">
          <LpiButton
            :disabled="isAsyncing || !hasReadAll"
            :label="$t('common.yes')"
            data-test="approve-terms"
            :btn-icon="isAsyncing ? 'LoaderSimple' : null"
            @click="onTermApproved"
          />
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<style scoped lang="scss">
.notice {
  font-style: italic;
  margin-bottom: 1rem;
  transition: opacity 0.3s ease;
}

.transparent {
  opacity: 0;
}

.instructions {
  background-color: $primary-lighter;
  padding: 1rem;
  border-radius: $border-radius-m;
  text-align: center;
}

.approve-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .action-buttons {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
}
</style>
