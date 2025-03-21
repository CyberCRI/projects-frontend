<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="form?.v$?.$invalid"
    :is-opened="isOpened"
    :title="$t('chat.drawer.title')"
    class="chat-drawer small"
    @confirm="saveChat"
    @close="cancel"
  >
    <form>
      <p class="notice">
        {{ $t('chat.drawer.notice') }}
      </p>

      <div class="form-section">
        <label class="label">{{ $t('chat.drawer.url.label') }}</label>
        <p class="notice">
          {{ $t('chat.drawer.url.notice') }}
        </p>
        <TextInput v-model="chat_url" :placeholder="$t('chat.drawer.url.placeholder')" />
      </div>

      <div class="form-section">
        <label class="label">{{ $t('chat.drawer.wording.label') }}</label>
        <p class="notice">
          {{ $t('chat.drawer.wording.notice') }}
        </p>
        <TextInput
          v-model="chat_button_text"
          :placeholder="$t('chat.drawer.wording.placeholder')"
        />
      </div>
    </form>
  </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { patchOrganization } from '@/api/organizations.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'EditChatDrawer',

  components: {
    BaseDrawer,
    TextInput,
  },

  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['close', 'chat-edited'],

  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    const org = this.organizationsStore.current

    return {
      chat_button_text: org.chat_button_text || '',
      chat_url: org.chat_url || '',
      asyncing: false,
    }
  },

  methods: {
    cancel() {
      this.$emit('close')
    },
    async saveChat() {
      this.asyncing = true

      try {
        const payload = {
          chat_button_text: this.chat_button_text,
          chat_url: this.chat_url,
        }

        await patchOrganization(this.organizationsStore.current?.code, payload)
        this.$emit('chat-edited')
        this.toaster.pushSuccess(this.$t('chat.drawer.success'))
      } catch (err) {
        this.toaster.pushError(`${this.$t('chat.drawer.error')} (${err})`)
        console.error(err)
      } finally {
        this.asyncing = false
        this.$emit('close')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.notice,
.label {
  display: block;
  padding-bottom: $space-m;
}

.form-section {
  padding-bottom: $space-l;
}
</style>
