import { maxLength, required, url } from '@vuelidate/validators'

import type { OptionsForm } from '~/composables/useForm'
import useForm from '~/composables/useForm'

type ChatForm = {
  chat_button_text: string
  chat_url: string
}

export const defaultChatForm = (): ChatForm => ({
  chat_button_text: '',
  chat_url: '',
})

export const useChatForm = (options: OptionsForm<ChatForm, ChatForm> = {}) => {
  const rules = computed(() => ({
    chat_button_text: {
      required,
      maxLength: maxLength(12),
    },
    chat_url: {
      required,
      url,
    },
  }))

  return useForm({
    default: defaultChatForm(),
    rules,
    ...options,
  })
}
