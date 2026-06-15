<script setup>
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'

const { t } = useNuxtI18n()

const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  document: { type: [Object, null], default: null },
  isEdit: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'document-added', 'document-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()

const file = ref(null)
const title = ref('')
const isGlobal = ref(false)

const { isSuperAdmin } = usePermissions()

const canEditGlobal = computed(() => isSuperAdmin.value && !props.isEdit)

const titleExists = ref(false)

watch(
  () => props.isOpened,
  (neo) => {
    if (neo) {
      file.value = null
      title.value = props.isEdit ? props.document.title : ''
      titleExists.value = false
      isGlobal.value = props.isEdit ? props.document.org_code == '' : false
    }
  }
)

const isAsyncing = ref(false)

const close = () => emit('close')

const submit = async () => {
  isAsyncing.value = true

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  if (!props.isEdit) {
    try {
      const query = new URLSearchParams()
      query.set('title', title.value)
      if (isGlobal.value) query.set('is_global', 'yes')
      const response = await fetch(`/api/vector-store/get?${query.toString()}`, {
        headers,
      })
      // Only attempt to parse JSON when the response is OK; handle 404/empty-body separately.
      if (response.status === 404) {
        // No existing document with this title; continue to ingestion.
      } else if (response.ok) {
        const existing = await response.json()
        if (Array.isArray(existing) && existing.length) {
          titleExists.value = true
          toaster.pushError(t('vector-store.title-exists'))
          isAsyncing.value = false
          return
        }
      } else {
        // Non-OK, non-404 response; log it and continue without blocking ingestion.
        console.log(
          `Unexpected response when checking title existence: ${response.status} ${response.statusText}`
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fd = new FormData()
  fd.append('title', title.value)
  fd.append('file', file.value[0], file.value[0].name)
  fd.append('is_global', isGlobal.value ? 'yes' : '')

  try {
    const response = await fetch(`/api/vector-store/ingest`, {
      body: fd,
      method: 'POST',
      headers,
    })
    if (response.ok) {
      toaster.pushSuccess(
        t(props.isEdit ? 'vector-store.document-updated' : 'vector-store.document-added')
      )
      emit(props.isEdit ? 'document-updated' : 'document-added')
    } else {
      toaster.pushError(`${response.status} - ${response.statusText}`)
    }
  } catch (e) {
    toaster.pushError(e.toString())
  } finally {
    isAsyncing.value = false
    close()
  }
}
</script>
<template>
  <BaseDrawer
    data-test="vector-store-add-document-drawer"
    :confirm-action-name="t('common.confirm')"
    :confirm-action-disabled="!title || !file"
    :is-opened="isOpened"
    :title="t(props.isEdit ? 'vector-store.edit-document' : 'vector-store.add-document')"
    class="medium"
    :asyncing="isAsyncing"
    @close="close"
    @confirm="submit"
  >
    <div v-if="isEdit">
      <VectorStoreGlobalPill v-if="isGlobal" />
    </div>
    <div class="form-section">
      <TextInput
        v-model.trim="title"
        :label="$t('vector-store.title-field')"
        :disabled="isEdit"
        @change="titleExists = false"
      />
      <p v-if="titleExists" class="error">{{ $t('vector-store.title-exists') }}</p>
    </div>
    <div class="form-section">
      <LpiCheckbox
        v-model="isGlobal"
        :disabled="!canEditGlobal"
        :label="$t('vector-store.is-global-field')"
      />
    </div>
    <div class="form-section">
      <label>{{ $t('vector-store.file-field') }} (.pdf, .txt, .docx)</label>
      <br />
      <FileInput
        file-types=".pdf,.txt,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        required
        :label="$t('file.upload')"
        v-model="file"
      />
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.error {
  color: $salmon;
}

.form-section ~ .form-section {
  margin-top: 1rem;
}
</style>
