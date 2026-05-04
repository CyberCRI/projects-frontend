<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpened"
    :title="$t('chat.drawer.title')"
    class="chat-drawer small"
    :confirm-action-disabled="!isValid"
    @confirm="saveChat"
    @close="cancel"
  >
    <form>
      <p class="notice">{{ $t('chat.drawer.notice') }}</p>

      <div class="form-section">
        <label class="label">{{ $t('chat.drawer.url.label') }} *</label>
        <p class="notice">
          {{ $t('chat.drawer.url.notice') }}
        </p>
        <TextInput
          v-model="form.chat_url"
          :placeholder="$t('chat.drawer.url.placeholder')"
          :errors="errors.chat_url"
        />
      </div>

      <div class="form-section">
        <label class="label">{{ $t('chat.drawer.wording.label') }} *</label>
        <p class="notice">
          {{ $t('chat.drawer.wording.notice') }}
        </p>
        <TextInput
          v-model="form.chat_button_text"
          :placeholder="$t('chat.drawer.wording.placeholder')"
          :errors="errors.chat_button_text"
        />
      </div>
    </form>
  </BaseDrawer>
</template>
<script setup lang="ts">
import { patchOrganization } from '~/api/organizations.service'

import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'
import { useChatForm } from '~/form/admin/chat'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
  }>(),
  { isOpened: false }
)

const emit = defineEmits<{
  close: []
  'chat-edited': []
}>()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()

const { form, errors, isValid, v$ } = useChatForm({
  default: {
    chat_button_text: organizationsStore.current.chat_button_text || '',
    chat_url: organizationsStore.current.chat_url || '',
  },
  lazy: true,
})

watch(
  () => props.isOpened,
  () => {
    form.value.chat_button_text = organizationsStore.current.chat_button_text || ''
    form.value.chat_url = organizationsStore.current.chat_url || ''
    v$.value.$reset()
  }
)

const asyncing = ref(false)

const cancel = () => emit('close')
const saveChat = async () => {
  if (!isValid.value) {
    return
  }
  asyncing.value = true

  try {
    const payload = {
      ...form.value,
    }
    await patchOrganization(organizationCode, payload)
    emit('chat-edited')
    toaster.pushSuccess(t('chat.drawer.success'))
  } catch (err) {
    toaster.pushError(`${t('chat.drawer.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    emit('close')
  }
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
