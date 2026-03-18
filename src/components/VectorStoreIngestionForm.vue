<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const props = defineProps({
  isOpened: {
    type: Boolean,
    required: true,
  },
  documentTitle: { type: String, default: '' },
  isEdit: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'document-added', 'document-updated'])

const toaster = useToasterStore()
const usersStore = useUsersStore()

const file = ref(null)
const title = ref('')

const titleExists = ref(false)

watch(
  () => [props.isOpened],
  (neo) => {
    if (neo) {
      file.value = null
      title.value = props.isEdit ? props.documentTitle : ''
      titleExists.value = false
    }
  }
)

const onFileChange = (e) => {
  let files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  file.value = files[0]
}

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
      const response = await fetch(`/api/vector-store/get?${query.toString()}`, {
        headers,
      })
      const existing = await response.json()
      if (existing.length) {
        titleExists.value = true
        toaster.pushError(t('vector-store.title-exists'))
        isAsyncing.value = false
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fd = new FormData()
  fd.append('title', title.value)
  fd.append('file', file.value, file.value.name)

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
      <label>{{ $t('vector-store.file-field') }}</label>
      <br />
      <input id="file" type="file" name="file" required @change="onFileChange" />
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.error {
  color: $salmon;
}
</style>
