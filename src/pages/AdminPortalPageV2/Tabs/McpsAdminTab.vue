<script setup>
const addEntityIsOpen = ref(false)
const entityToDelete = ref('')

const isAsyncing = ref(false)

const deleteEntity = async () => {
  isAsyncing.value = true
  // let headers = {}
  // const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  // if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
  // const query = new URLSearchParams()
  // query.set('title', documentToDelete.value)

  // try {
  // const response = await fetch(`/api/vector-store/delete?${query.toString()}`, {
  //   headers,
  //   method: 'DELETE',
  // })
  // if (response.ok) {
  //   await response.json()
  //   refreshDocumentList()
  //   toaster.pushSuccess(t('vector-store.document-deleted', { title: documentToDelete.value }))
  // } else {
  //   toaster.pushError(`${response.status} - ${response.statusText}`)
  // }
  // } catch (e) {
  // console.log(e.toString())
  // toaster.pushError(e.toString())
  // } finally {
  //   documentToDelete.value = ''
  //   isAsyncing.value = false
  // }
}
</script>
<template>
  <div class="vector-store-admin-tab">
    <div class="actions">
      <LpiButton
        btn-icon="Plus"
        :label="$t('vector-store.add-document')"
        @click="addEntityIsOpen = true"
      />
    </div>

    <ConfirmModal
      v-if="entityToDelete"
      :asyncing="isAsyncing"
      :title="$t('vector-store.confirm-deletion')"
      :content="$t('vector-store.confirm-deletion-of', { title: entityToDelete })"
      @confirm="deleteEntity"
      @cancel="entityToDelete = ''"
    />
  </div>
</template>
