<script setup>
import useUsersStore from '~/stores/useUsers'
import useToasterStore from '~/stores/useToaster'

const toaster = useToasterStore()
const usersStore = useUsersStore()
const { t } = useNuxtI18n()

const showDocumentTitle = ref('')
const addDocumentIsOpen = ref(false)
const documentToDelete = ref('')
const documentToEdit = ref('')

const docList = ref(null)
const refreshDocumentList = () => docList.value?.refresh()

const isAsyncing = ref(false)

const deleteDocument = async () => {
  isAsyncing.value = true
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  const query = new URLSearchParams()
  query.set('title', documentToDelete.value)

  try {
    const response = await fetch(`/api/vector-store/delete?${query.toString()}`, {
      headers,
      method: 'DELETE',
    })
    if (response.ok) {
      await response.json()
      refreshDocumentList()
      toaster.pushSuccess(t('vector-store.document-deleted', { title: documentToDelete.value }))
    } else {
      toaster.pushError(`${response.status} - ${response.statusText}`)
    }
  } catch (e) {
    console.log(e.toString())
    toaster.pushError(e.toString())
  } finally {
    documentToDelete.value = ''
    isAsyncing.value = false
  }
}
</script>
<template>
  <div class="vector-store-admin-tab">
    <div class="actions">
      <LpiButton
        btn-icon="Plus"
        :label="$t('vector-store.add-document')"
        @click="addDocumentIsOpen = true"
      />
    </div>
    <VectorStoreDocumentList
      ref="docList"
      @show-document="showDocumentTitle = $event"
      @delete-document="documentToDelete = $event"
      @edit-document="documentToEdit = $event"
    />

    <VectorStoreDocumentShow
      v-if="showDocumentTitle"
      :document-title="showDocumentTitle"
      @close="showDocumentTitle = ''"
      @confirm="showDocumentTitle = ''"
    />
    <VectorStoreIngestionForm
      :is-opened="addDocumentIsOpen"
      @close="addDocumentIsOpen = false"
      @document-added="refreshDocumentList"
    />
    <VectorStoreIngestionForm
      :is-opened="!!documentToEdit"
      :document-title="documentToEdit"
      is-edit
      @close="documentToEdit = ''"
      @document-updated="documentToEdit = ''"
    />
    <ConfirmModal
      v-if="documentToDelete"
      :asyncing="isAsyncing"
      :title="$t('vector-store.confirm-deletion')"
      :content="$t('vector-store.confirm-deletion-of', { title: documentToDelete })"
      @confirm="deleteDocument"
      @cancel="documentToDelete = ''"
    />
  </div>
</template>
<style lang="scss" scoped>
.actions {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
