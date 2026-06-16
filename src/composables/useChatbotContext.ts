import useUsersStore from '@/stores/useUsers'

import { SDGS } from '~/functs/constants'
// gloabls !
const _allowProfile = ref(false)
const _allowCurrentPage = ref(false)

export default function useChatbotContext({ hasUserContext, hasPageContext, contextMessageRole }) {
  const usersStore = useUsersStore()

  const allowProfile = computed(() => unref(hasUserContext) && _allowProfile.value)
  if (import.meta.client) {
    _allowProfile.value = !!localStorage?.getItem('lpi-chatbot-allow-profile')
  }
  const updateAllowProfile = () => {
    _allowProfile.value = !_allowProfile.value
    if (import.meta.client) {
      localStorage?.setItem('lpi-chatbot-allow-profile', _allowProfile.value ? 'true' : '')
    }
  }

  const userContextPrefix =
    '# Use the following information about the user to tailor your response toward the user interests'
  const userContext = computed(() => {
    const user = usersStore.userFromApi
    if (!user || !allowProfile.value) return ''
    // TODO: groups and projects
    return `
    ${userContextPrefix}
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

  const allowCurrentPage = computed(() => unref(hasPageContext) && _allowCurrentPage.value)
  if (import.meta.client) {
    _allowCurrentPage.value = !!localStorage?.getItem('lpi-chatbot-allow-current-page')
  }
  const updateAllowCurrentPage = () => {
    _allowCurrentPage.value = !_allowCurrentPage.value
    if (import.meta.client) {
      localStorage?.setItem('lpi-chatbot-allow-current-page', _allowCurrentPage.value ? 'true' : '')
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

  const computePageContextMetaPrefix = '# here are some meta information about the current page'
  const computePageContextPrefix =
    '# Here is the content of the current page, use it as a context for your responses'

  const computePageContext = () => {
    let res = ''
    const pageMeta = route.matched
      .filter((r) => !!r.meta.chatBotContext)
      .map((r) => (r.meta.chatBotContext as (r: any) => string)(route))
      .join('\n')

    if (pageMeta)
      res += `${computePageContextMetaPrefix}
        ${pageMeta}
      `
    if (import.meta.client) {
      res += `${computePageContextPrefix}:
        ${document.querySelector('.main-view')?.textContent || ''}
        `
      pageContextData.value = res
    }
  }
  const contextMessages = computed(() => [
    {
      role: contextMessageRole || 'assistant',
      text: userContext.value,
    },
    {
      role: contextMessageRole || 'assistant',
      text: pageContext.value,
    },
  ])

  function filterContextMesssages(message) {
    return ![userContextPrefix, computePageContextMetaPrefix, computePageContextPrefix].some(
      (contextPrefix) => (message.content || '').trim().startsWith(contextPrefix)
    )
  }

  return {
    allowProfile,
    updateAllowProfile,
    allowCurrentPage,
    updateAllowCurrentPage,
    computePageContext,
    contextMessages,
    userContextPrefix,
    computePageContextMetaPrefix,
    computePageContextPrefix,
    filterContextMesssages,
  }
}
