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
        <strong>{{ $t('chat.data.wording') }}</strong> <span>{{ chat_button_text }}</span>
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
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import EditChatDrawer from '@/components/admin/GeneralAdminBlocks/Chat/EditChatDrawer.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'ChatAdminBlock',

  components: {
    AdminBlock,
    LinkButton,
    EditChatDrawer,
  },
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },
  data() {
    return {
      editChatIsOpen: false,
    }
  },

  computed: {
    organization() {
      return this.organizationsStore.current
    },

    blockTitle() {
      return this.$t('admin.portal.chat')
    },
    hasChat() {
      return !!this.chat_url
    },

    chat_button_text() {
      return this.organization?.chat_button_text || this.$t('chat.data.no-wording')
    },

    chat_url() {
      return this.organization?.chat_url
    },
  },

  methods: {
    reloadOrganization() {
      this.organizationsStore.getCurrentOrganization(this.organization.code)
    },
  },
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
