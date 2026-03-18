<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const { t } = useNuxtI18n()

const props = defineProps({ isOpened: { type: Boolean, required: true } })
const emit = defineEmits(['close', 'document-added'])

const toaster = useToasterStore()
const usersStore = useUsersStore()

const file = ref(null)
const title = ref('')

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  file.value = files[0]
}

const isAsyncing = ref(false)

const close = () => emit('close')

const submit = async () => {
  isAsyncing.value = true
  const fd = new FormData()
  fd.append('title', title.value)
  fd.append('file', file.value, file.value.name)

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    const response = await fetch(`/api/vector-store/ingest`, {
      body: fd,
      method: 'POST',
      headers,
    })
    if (response.ok) {
      toaster.pushSuccess('Vector store updated')
      emit('document-added')
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
    :title="t('vector-store.add-document')"
    class="medium"
    @close="close"
    @confirm="submit"
  >
    <div class="form-section">
      <TextInput v-model.trim="title" :label="$t('vector-store.title-field')" />
    </div>
    <div class="form-section">
      <input id="file" type="file" name="file" required @change="onFileChange" />
    </div>
  </BaseDrawer>
</template>
