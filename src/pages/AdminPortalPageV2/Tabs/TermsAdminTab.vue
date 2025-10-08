<script setup>
import { patchTermsAndConditions } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'
import useToasterStore from '@/stores/useToaster.ts'

const { t } = useI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizations()

const currentOrganization = computed(() => organizationsStore.current)

// TODO: use default term of service content ?
const termsContent = ref('<p></p>')

const isLoading = ref(true)

const resetTerms = () => {
  termsContent.value = organizationsStore?.termsContent || '<p></p>'
}

const isAsyncing = ref(false)

const saveTerms = async () => {
  if (!currentOrganization) return
  isAsyncing.value = true
  try {
    await patchTermsAndConditions(currentOrganization.value, termsContent.value)
    organizationsStore.getCurrentOrganization(currentOrganization.value.code)
    toaster.pushSuccess(t('admin.terms.saved'))
  } catch (err) {
    console.error(err)
    toaster.pushError(`${t('tadmin.terms.error')} (${err})`)
  } finally {
    isAsyncing.value = false
  }
}
watch(
  () => currentOrganization?.value?.code,
  (neo, old) => {
    if (neo && neo !== old) {
      resetTerms()
      isLoading.value = false
    }
  },
  { immediate: true }
)
</script>
<template>
  <div class="page-section-narrow legal-page terms-of-service page-top">
    <h1 class="page-title">Conditions générales d’utilisation</h1>
    <div v-if="isLoading" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <p v-if="!organizationsStore?.hasTerms" class="notice">
        {{ $t('admin.terms.using-default') }}
      </p>
      <TipTapEditor
        ref="tiptapEditor"
        v-model="termsContent"
        :save-image-callback="saveDescriptionImage"
        class="no-max-height"
        mode="full"
      />
      <div class="actions">
        <LpiButton
          :disabled="isAsyncing"
          :label="$t('common.cancel')"
          secondary
          @click="resetTerms"
        />
        <LpiButton
          :disabled="isAsyncing"
          :btn-icon="isAsyncing ? 'LoaderSimple' : undefined"
          :label="$t('common.save')"
          @click="saveTerms"
        />
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-block: 5rem;
}

.notice {
  font-style: italic;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
  background-color: $primary-lighter;
  border-radius: $border-radius-m;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
