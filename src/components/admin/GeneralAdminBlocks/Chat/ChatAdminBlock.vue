<template>
  <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
    <template #actions>
      <LinkButton
        v-if="hasChat"
        btn-icon="Pen"
        :label="$t('common.edit')"
        @click="editChatIsOpen = true"
      />
      <LinkButton v-else btn-icon="Plus" :label="$t('common.add')" @click="editChatIsOpen = true" />
    </template>
    <template v-if="hasChat" #default>
      <p class="chat-data">
        <strong>{{ $t('chat.data.wording') }}</strong>
        <span>{{ chat_button_text }}</span>
      </p>
      <p class="chat-data">
        <strong>{{ $t('chat.data.link') }}</strong>
        <a v-if="chat_url" target="_blank" :href="chat_url">{{ chat_url }}</a>
        <span v-else>{{ $t('chat.data.no-link') }}</span>
      </p>
    </template>
  </AdminBlock>
  <EditChatDrawer
    :is-opened="editChatIsOpen"
    @close="editChatIsOpen = false"
    @chat-edited="reloadOrganization"
  />
</template>

<script setup lang="ts">
import EditChatDrawer from '~/components/admin/GeneralAdminBlocks/Chat/EditChatDrawer.vue'
import LinkButton from '~/components/base/button/LinkButton.vue'

import useOrganizationsStore from '~/stores/useOrganizations'

const organizationsStore = useOrganizationsStore()
const editChatIsOpen = ref(false)
const isLoading = ref(false)
const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()

const organization = computed(() => organizationsStore.current)

const blockTitle = computed(() => {
  return t('admin.portal.chat')
})

const chat_url = computed(() => organization.value?.chat_url)
const hasChat = computed(() => !!chat_url.value)

const chat_button_text = computed(() => {
  return organization.value?.chat_button_text || t('chat.data.no-wording')
})

const reloadOrganization = () => {
  organizationsStore.getCurrentOrganization(organizationCode)
}
</script>
<style lang="scss" scoped>
.chat-data {
  & + .chat-data {
    margin-top: $space-m;
  }

  strong {
    font-weight: bold;
  }

  a {
    color: $primary-dark;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
