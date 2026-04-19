import useUsersStore from '@/stores/useUsers'

import sdgJson from '@/data/sdgs.json'
// gloabls !
const _allowProfile = ref(false)
const _allowCurrentPage = ref(false)

export default function useChatbotContext({ hasUserContext, hasPageContext }) {
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
      .map((sid) => sdgJson[sid - 1])
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

  const computePageContext = () => {
    let res = ''
    const pageMeta = route.matched
      .filter((r) => !!r.meta.chatBotContext)
      .map((r) => (r.meta.chatBotContext as (r: any) => string)(route))
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
  }
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

  return {
    allowProfile,
    updateAllowProfile,
    allowCurrentPage,
    updateAllowCurrentPage,
    computePageContext,
    contextMessages,
  }
}
