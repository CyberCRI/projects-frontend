<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const toaster = useToasterStore()
const usersStore = useUsersStore()
const { t } = useNuxtI18n()

const addEntityIsOpen = ref(false)
const entityToShow = ref(null)
const entityToDelete = ref(null)
const entityToEdit = ref(null)

const entityList = ref(null)
const refreshEntityList = () => entityList.value?.refresh()

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

    <AgentAdminList
      ref="entityList"
      @show-entity="entityToShow = $event"
      @delete-entity="entityToDelete = $event"
      @edit-entity="entityToEdit = $event"
    />

    <AgentAdminShow
      v-if="entityToShow"
      :agent="entityToShow"
      @close="entityToShow = null"
      @confirm="entityToShow = null"
    />

    <AgentAdminShow
      v-if="entityToShow"
      :agent="entityToShow"
      @close="entityToShow = null"
      @confirm="entityToShow = null"
    />

    <AgentAdminForm
      :is-opened="addEntityIsOpen"
      @close="addEntityIsOpen = false"
      @entity-added="refreshEntityList"
    />
    <AgentAdminForm
      :is-opened="!!entityToEdit"
      :agentToEdit="entityToEdit"
      is-edit
      @close="entityToEdit = null"
      @entity-updated="entityToEdit = null"
    />

    <ConfirmModal
      v-if="entityToDelete"
      :asyncing="isAsyncing"
      :title="$t('vector-store.confirm-deletion')"
      :content="$t('vector-store.confirm-deletion-of', { title: entityToDelete.title })"
      @confirm="deleteEntity"
      @cancel="entityToDelete = null"
    />
  </div>
</template>
