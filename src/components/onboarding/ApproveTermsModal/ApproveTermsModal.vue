<script setup lang="ts">
// import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'
import { patchUser } from '@/api/people.service'
const organizationsStore = useOrganizations()
const usersStore = useUsersStore()
const toaster = useToasterStore()

const { t } = useI18n()

const orgCode = computed(() => organizationsStore?.current?.code || '')

const signedTerms = computed(() => usersStore.user?.signed_terms_and_conditions || {})

const lastApprovedVersion = computed(() => {
  if (!usersStore.isConnected) return null
  return signedTerms.value?.[orgCode.value]?.version || null
})

const lastApprovedDate = computed(() => {
  if (!usersStore.isConnected) return null
  return signedTerms.value?.[orgCode.value]?.date || null
})

const needsAproval = computed(() => {
  if (!usersStore.isConnected) return false
  // if (!lastApprovedVersion.value) return true
  if (!lastApprovedDate.value) return true
  if (organizationsStore.termsUpdatedAt) {
    const lastApproval = new Date(lastApprovedDate.value).toISOString()
    const updateDate = new Date(organizationsStore.termsUpdatedAt).toISOString()
    return updateDate > lastApproval
    // return organizationsStore.termsVersion > lastApprovedVersion.value
  }
  return false
})

const termsDateStr = computed(() =>
  organizationsStore.termsUpdatedAt
    ? new Date(organizationsStore.termsUpdatedAt).toLocaleString()
    : ''
)

const firstnotice = useTemplateRef('firstnotice')
const hasReadAll = ref(false)

const onTosScroll = (e) => {
  const scrollable = e.target
  const maxScroll = Math.floor(scrollable.scrollHeight - scrollable.offsetHeight) - 8
  if (Math.ceil(scrollable.scrollTop) >= maxScroll) {
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
  const user = usersStore.userFromApi
  if (!user) return
  isAsyncing.value = true
  const payload = {
    signed_terms_and_conditions: {
      ...signedTerms?.value,
      [orgCode.value]: {
        version: organizationsStore.termsVersion,
        date: new Date().toISOString(),
      },
    },
  }
  try {
    await patchUser(user.id, payload)
    await usersStore.getUser(user.id)
    if (window?.lpiSharedWorker) {
      window?.lpiSharedWorker.port.postMessage({
        type: 'TOS_ACCEPTED',
        payload: JSON.parse(JSON.stringify(payload.signed_terms_and_conditions)),
      })
    }
  } catch (err) {
    console.error(err)
    toaster.pushError(t('tos.error-approving'))
    // mock acceptance (non persited past next reload)
    // to still allow navigation in case of trouble
    user.signed_terms_and_conditions = payload.signed_terms_and_conditions
  } finally {
    isAsyncing.value = false
  }
}
</script>
<template>
  <BaseModal
    v-if="needsAproval"
    modal-id="approve-terms-modal"
    :can-close="false"
    @content-scroll="onTosScroll"
  >
    <template #header-title>{{ $t('tos.approve-title') }}</template>
    <template #content>
      <p v-if="lastApprovedVersion" ref="firstnotice" class="notice instructions">
        {{ $t('tos.evolved') }}
      </p>
      <p v-else ref="firstnotice" class="notice instructions">
        {{ $t('tos.review-and-sign') }}
      </p>
      <p v-if="termsDateStr" class="terms-version">
        {{ $t('admin.terms.version') }} {{ termsDateStr }}
      </p>
      <div class="tos-content">
        <TipTapOutput
          v-if="organizationsStore?.hasTerms"
          :content="organizationsStore?.termsContentTranslated"
        />
        <DefaultTermsOfService v-else />
      </div>
    </template>
    <template #footer>
      <div class="approve-footer">
        <p class="notice" :class="{ transparent: hasReadAll }">
          {{ $t('tos.scroll-notice') }}
        </p>
        <div class="action-buttons">
          <LpiButton
            :disabled="isAsyncing || !hasReadAll"
            :label="$t('tos.approve-button')"
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

.terms-version {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: right;
  color: $mid-gray;
}
</style>
