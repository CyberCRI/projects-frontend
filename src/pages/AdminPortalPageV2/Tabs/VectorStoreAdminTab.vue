<script setup lang="ts">
import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

if (!useRuntimeConfig().public.appHasVectorDb) {
  usePage404()
}

if (!useRuntimeConfig().public.appHasVectorDb) {
  usePage404()
}

const toaster = useToasterStore()
const usersStore = useUsersStore()
const { t } = useNuxtI18n()

const documentToShow = ref(null)
const addDocumentIsOpen = ref(false)
const documentToDelete = ref(null)
const documentToEdit = ref(null)

const docList = ref(null)
const refreshDocumentList = () => docList.value?.refresh()

const isAsyncing = ref(false)

const deleteDocument = async () => {
  isAsyncing.value = true
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  const query = new URLSearchParams()
  query.set('title', documentToDelete.value.title)
  if (documentToDelete.value.org_code == '') query.set('is_global', 'yes')

  try {
    const response = await fetch(`/api/vector-store/delete?${query.toString()}`, {
      headers,
      method: 'DELETE',
    })
    if (response.ok) {
      await response.json()
      refreshDocumentList()
      toaster.pushSuccess(
        t('vector-store.document-deleted', { title: documentToDelete.value.title })
      )
    } else {
      toaster.pushError(`${response.status} - ${response.statusText}`)
    }
  } catch (e) {
    console.log(e.toString())
    toaster.pushError(e.toString())
  } finally {
    documentToDelete.value = null
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
      @show-document="documentToShow = $event"
      @delete-document="documentToDelete = $event"
      @edit-document="documentToEdit = $event"
    />

    <VectorStoreDocumentShow
      v-if="documentToShow"
      :document="documentToShow"
      @close="documentToShow = null"
      @confirm="documentToShow = null"
    />
    <VectorStoreIngestionForm
      :is-opened="addDocumentIsOpen"
      @close="addDocumentIsOpen = false"
      @document-added="refreshDocumentList"
    />
    <VectorStoreIngestionForm
      :is-opened="!!documentToEdit"
      :document="documentToEdit"
      is-edit
      @close="documentToEdit = null"
      @document-updated="documentToEdit = null"
    />
    <ConfirmModal
      v-if="documentToDelete"
      :asyncing="isAsyncing"
      :title="$t('vector-store.confirm-deletion')"
      :content="
        $t('vector-store.confirm-deletion-of', {
          title:
            (documentToDelete.org_code == ''
              ? `!!![${$t('vector-store.is-global-label').toUpperCase()}]!!!  `
              : '') + documentToDelete.title,
        })
      "
      @confirm="deleteDocument"
      @cancel="documentToDelete = null"
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
