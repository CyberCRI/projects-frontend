<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

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
    const response = await $fetch(`/api/agent/${entityToDelete.value.id}`, {
      headers,
      method: 'DELETE',
    })
    console.log('delete', response)
    refreshEntityList()
    toaster.pushSuccess(t('agents.deleted'))
  } catch (e) {
    console.log(e.toString())
    toaster.pushError(t('agents.delete-error'))
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
        :label="$t('agents.create-agent')"
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

    <AgentAdminForm
      :is-opened="addEntityIsOpen || !!entityToEdit"
      :agent="entityToEdit"
      @close="onCloseAdminForm"
      @entity-created="onEntityUpdated"
      @entity-updated="onEntityUpdated"
    />

    <ConfirmModal
      v-if="entityToDelete"
      :asyncing="isAsyncing"
      :title="$t('agents.confirm-deletion')"
      :content="$t('agents.confirm-deletion-of', { title: entityToDelete.title })"
      @confirm="deleteEntity"
      @cancel="entityToDelete = null"
    />
  </div>
</template>
<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 2rem;
}
</style>
