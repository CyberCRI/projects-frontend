<script setup>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import useUsersStore from '@/stores/useUsers'

// type Params = Parameters<typeof useFetch>
const usersStore = useUsersStore()
const isConnected = computed(() => usersStore.isConnected)

if (!useRuntimeConfig().public.appHasChatbotPromptDb) {
  usePage404()
}

const login = () => {
  goToKeycloakLoginPage()
}

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')

if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = {
  headers,
  server: false, // ⚠️ Crucial: Skips server execution
}

const url = `/api/chatbot`
const { data, status } = useFetch(url, { ...options })
const agents = computed(() => data.value?.agents)

const isLoading = computed(() => status.value == 'pending')

useLpiHead2({
  title: computed(() => agent.value?.title),
  description: computed(() => agent.value?.description),
})
</script>
<template>
  <div class="page-section page-section-narrow page-top">
    <div>
      <h1 class="page-title">
        {{ $t('agents-home.title') }}
      </h1>
      <p class="intro">
        {{ $t('agents-home.intro') }}
      </p>
    </div>
    <div v-if="!isConnected">
      <p class="login-notice centered">
        {{ $t('agents.need-login') }}
      </p>
      <div class="login-button centered">
        <LpiButton :label="$t('common.login')" @click="login" />
      </div>
    </div>
    <div v-else-if="isLoading" class="loader">
      <LoaderSimple />
    </div>
    <div v-else>
      <p v-if="!agents.length" class="centered">
        {{ $t('agents.no-active-agent-yet') }}
      </p>
      <div v-else class="agent-list">
        <NuxtLink
          v-for="agent in agents"
          :key="agent.id"
          :to="{ name: 'AgentPage', params: { agentSlug: agent.slug } }"
          class="agent-card"
        >
          <div class="picto">
            <IconImage class="agent-face" name="ChatBubble" />
          </div>
          <div class="wording">
            <h3 class="title">{{ agent.title }}</h3>
            <p class="description">
              {{ agent.description.replace(/<[^>]*?>/gim, ' ') }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.agent-list {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  margin-block: 2rem;
}

.intro {
  margin: 3rem auto;
  padding: 1rem;
  background-color: $primary-lighter;
  border-radius: 1rem;
  max-width: 28rem;
  font-size: 1.2em;
}

.agent-card {
  display: flex;
  flex-flow: row;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid $primary-dark;
  border-radius: 0.5rem;
}

.picto {
  flex: 0 0 6rem;

  .agent-face {
    width: 5rem;
    fill: $yellow;
  }
}

.wording {
  flex-grow: 1;

  .title {
    color: $primary-dark;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .description {
    margin-top: 1rem;
  }
}

.loader {
  display: flex;
  justify-content: center;
}

.centered {
  display: flex;
  justify-content: center;
}
</style>
