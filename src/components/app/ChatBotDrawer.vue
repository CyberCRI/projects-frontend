<script setup>
import 'deep-chat'
import analytics from '@/analytics'
import useUsersStore from '@/stores/useUsers.ts'
import { shuffle } from 'es-toolkit'
import { SDGS } from '@/functs/constants'

const { t } = useNuxtI18n()
const router = useRouter()
const props = defineProps({
  isOpened: { type: Boolean, default: false },
})

watch(
  () => props.isOpened,
  (neo, old) => {
    if (neo != old) {
      if (neo) {
        analytics.chatbot.open()
      } else {
        analytics.chatbot.close()
      }
    }
  }
)

onErrorCaptured((err) => {
  console.error('ChatBotDrawer error', err)
  analytics.chatbot.error(err.message || err)
  return false
})

const emit = defineEmits(['close'])

const CHAT_ENDPOINT = ref(useRuntimeConfig().public.appChatbotBackend || '/api/chat-lg-stream')

const usersStore = useUsersStore()
const accessToken = usersStore.accessToken

const allowProfile = ref(false)
if (import.meta.client) {
  allowProfile.value = !!localStorage?.getItem('lpi-chatbot-allow-profile')
}
const updateAllowProfile = () => {
  allowProfile.value = !allowProfile.value
  if (import.meta.client) {
    localStorage?.setItem('lpi-chatbot-allow-profile', allowProfile.value ? 'true' : '')
  }
}

const userContext = computed(() => {
  const user = usersStore.userFromApi
  if (!user || !allowProfile.value) return ''
  // TODO: groups and projects
  return `
  # Use the following information about the user to tailor your response toward the user interests
  - Name: ${user.family_name} ${user.given_name}
  - Pronouns: ${user.pronouns}
  - Job: ${user.job}
  - Active since: ${user.created_at}
  - Birthdate: ${user.birthdate}
  - Short description: ${user.short_description}
  - Description: ${user.description}
  - SDGs of interest: ${user.sdgs
    .map((sid) => SDGS[sid - 1])
    .filter((s) => !!s)
    .map((s) => s.title + ' - ' + s.description)
    .join('; ')}
  - Skills:  ${user.skills
    .filter((s) => !!s && s.type === 'skill')
    .map((s) => s.tag?.title + ' - ' + s.tag?.description + ' (Level ' + s.level + ')')
    .join('; ')}
  - Hobbies:  ${user.skills
    .filter((s) => !!s && s.type === 'hobby')
    .map((s) => s.tag?.title + ' - ' + s.tag?.description + ' (Level ' + s.level + ')')
    .join('; ')}
  `
})

const allowCurrentPage = ref(false)
if (import.meta.client) {
  allowCurrentPage.value = !!localStorage?.getItem('lpi-chatbot-allow-current-page')
}
const updateAllowCurrentPage = () => {
  allowCurrentPage.value = !allowCurrentPage.value
  if (import.meta.client) {
    localStorage?.setItem('lpi-chatbot-allow-current-page', allowCurrentPage.value ? 'true' : '')
  }
}

const route = useRoute()
const pageContextData = ref('')
const pageContext = computed(() => {
  // keep this out the if so it is registred for reactivity
  const pageData = pageContextData.value
  if (allowCurrentPage.value) return pageData
  else return ''
})
watch(
  () => [props.isOpened, route],
  () => {
    let res = ''
    const pageMeta = route.matched
      .filter((r) => !!r.meta.chatBotContext)
      .map((r) => r.meta.chatBotContext(route))
      .join('\n')

    if (pageMeta)
      res += `# here are some meta information about the current page
      ${pageMeta}
    `
    if (import.meta.client) {
      res += `# Here is the content of the current page, use it as a context for your responses:
      ${document.querySelector('.main-view')?.textContent || ''}
      `
      pageContextData.value = res
    }
  },
  { immediate: true }
)
const contextMessages = computed(() => [
  {
    role: 'assistant',
    text: userContext.value,
  },
  {
    role: 'assistant',
    text: pageContext.value,
  },
])
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <Chatbot :endpoint="CHAT_ENDPOINT" :context-messages="contextMessages">
      <div style="margin: 1rem; padding: 1rem; background-color: #f3f3f3; border-radius: 10px">
        <p>
          {{ $t('chatbot.before-we-start') }}
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              :checked="allowProfile"
              style="accent-color: #1d727c"
              @click="updateAllowProfile"
            />
            {{ $t('chatbot.allow-profile') }}
          </label>
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              :checked="allowCurrentPage"
              style="accent-color: #1d727c"
              @click="updateAllowCurrentPage"
            />
            {{ $t('chatbot.allow-current-page') }}
          </label>
        </p>
      </div>
      <div style="margin: 1rem; padding: 1rem; background-color: #f3f3f3; border-radius: 10px">
        <p>
          {{ $t('chatbot.intro-message') }}
        </p>
        <menu v-if="suggestButtons?.length" class="prompt-suggestions" style="padding-left: 0">
          <li
            v-for="button in suggestButtons"
            :key="button"
            style="list-style-type: none; margin: 0"
          >
            <a class="prompt-suggestion" href="#" @click.prevent="onSuggestButtonClick(button)">
              <IconImage
                class="icon"
                name="ChatBubble"
                style="width: 1.6em; height: 1em; vertical-align: middle; fill: #666"
              />
              {{ button }}
            </a>
          </li>
        </menu>
      </div>
    </Chatbot>
  </BaseDrawer>
</template>
