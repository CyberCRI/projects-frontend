<script setup lang="ts">
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'

if (!useRuntimeConfig().public.appHasChatbotPromptDb) {
  usePage404()
}

const toaster = useToasterStore()
const usersStore = useUsersStore()
const { t } = useNuxtI18n()

const addEntityIsOpen = ref(false)
const entityToShow = ref(null)
const entityToDelete = ref(null)
const entityToEdit = ref(null)

const entityList = useTemplateRef('entityList')
const refreshEntityList = () => entityList.value?.refresh()

const isAsyncing = ref(false)

const deleteEntity = async () => {
  if (!entityToDelete.value) return
  isAsyncing.value = true
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
  try {
    await $fetch(`/api/mcp/${entityToDelete.value.id}`, {
      headers,
      method: 'DELETE',
    })
    refreshEntityList()
    toaster.pushSuccess(t('agent-mcps.deleted'))
  } catch (e) {
    console.log(e.toString())
    toaster.pushError(t('agent-mcps.delete-error'))
  } finally {
    entityToDelete.value = ''
    isAsyncing.value = false
  }
}

const onEntityUpdated = () => {
  entityToEdit.value = null
  refreshEntityList()
}

const onCloseAdminForm = () => {
  entityToEdit.value = null
  addEntityIsOpen.value = false
}
</script>
<template>
  <div class="vector-store-admin-tab">
    <div class="actions">
      <LpiButton
        btn-icon="Plus"
        :label="$t('agent-mcps.add-document')"
        @click="addEntityIsOpen = true"
      />
    </div>

    <McpAdminList
      ref="entityList"
      @show-entity="entityToShow = $event"
      @delete-entity="entityToDelete = $event"
      @edit-entity="entityToEdit = $event"
    />

    <McpAdminShow
      v-if="entityToShow"
      :mcp="entityToShow"
      @close="entityToShow = null"
      @confirm="entityToShow = null"
    />

    <McpAdminForm
      :is-opened="addEntityIsOpen || !!entityToEdit"
      :mcp="entityToEdit"
      @close="onCloseAdminForm"
      @entity-created="onEntityUpdated"
      @entity-updated="onEntityUpdated"
    />

    <ConfirmModal
      v-if="entityToDelete"
      :asyncing="isAsyncing"
      :title="$t('agent-mcps.confirm-deletion')"
      :content="$t('agent-mcps.confirm-deletion-of', { title: entityToDelete.title })"
      @confirm="deleteEntity"
      @cancel="entityToDelete = null"
    />
  </div>
</template>
