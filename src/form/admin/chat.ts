import { maxLength, required, url } from '@vuelidate/validators'

import type { OptionsForm } from '~/composables/useForm'
import useForm from '~/composables/useForm'

import { clone } from 'es-toolkit'

type ChatForm = {
  chat_button_text: string
  chat_url: string
}

const DEFAULT_FORM: ChatForm = {
  chat_button_text: '',
  chat_url: '',
}

const RULES = {
  chat_button_text: {
    required,
    maxLength: maxLength(12),
  },
  chat_url: {
    required,
    url,
  },
}

export const useChatForm = (options: OptionsForm<ChatForm, ChatForm> = {}) => {
  return useForm({ default: clone(DEFAULT_FORM), rules: clone(RULES), ...options })
}
