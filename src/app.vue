<template>
  <div id="APP" :class="[/*themeclass,*/ currentRouteName, { 'has-open-drawer': isLoading }]">
    <Transition appear name="background-appear">
      <div v-if="globalsStore.uiIsLocked" class="loader-backdrop">
        <LoaderSimple />
      </div>
    </Transition>
    <LpiHeader />
    <div id="scrollview" ref="scrollview" data-test="scrollview">
      <div class="main-view">
        <NuxtPage />
      </div>
      <LpiFooter @on-click="toggleReportBugModal" />
    </div>
    <AppToastList />
    <ConfirmModal
      v-if="globalsStore.confirmDiscardPendingEditsPromise"
      :title="$t('globals.pending-edits.title')"
      :content="$t('globals.pending-edits.content')"
      :cancel-button-label="$t('common.no')"
      :confirm-button-label="$t('common.yes')"
      @cancel="globalsStore.confirmDiscardPendingEditsPromise(false)"
      @confirm="globalsStore.confirmDiscardPendingEditsPromise(true)"
    />

    <ClientOnly v-if="hasChatBot">
      <ChatBotDrawer :is-opened="isChatBotOpen" @close="isChatBotOpen = false" />
      <button class="floating-chat-icon" @click="isChatBotOpen = true">
        <span class="chatbot-label">{{ $t('chatbot.drawer-button-label') }}</span>
        <IconImage class="chatbot-icon" name="SparklingFill" />
      </button>
    </ClientOnly>
  </div>
</template>

<script setup>
import LpiFooter from '@/components/app/LpiFooter.vue'
import AppToastList from '@/components/app/AppToastList.vue'
import LpiHeader from '@/components/app/LpiHeader.vue'
import { checkExpiredToken } from '@/api/auth/keycloakUtils.ts'
import useUsersStore from '@/stores/useUsers.ts'
import useKeycloak from '@/api/auth/keycloak.ts'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useGlobalsStore from '@/stores/useGlobals.ts'
import { fixTiptapTableHeight } from '@/functs/editorUtils.ts'

useRuntimeHook('app:error', (error) => {
  console.log('app:error', error)
})

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const keycloak = useKeycloak()

const reportBugModalActive = ref(false)
const isLoading = false

const globalsStore = useGlobalsStore()

const usersStoreToken = computed(() => {
  return usersStore.accessToken
})

const currentRouteName = computed(() => {
  // Fix buefy class overwrite css since we renamed concepts->tags
  if (route.name === 'tags') return ''

  return route.name
})

const isChatBotOpen = ref(false)

const hasChatBot = computed(
  () => !!useRuntimeConfig().public.appChatbotEnabled && usersStore.isConnected
)

const toggleReportBugModal = () => {
  reportBugModalActive.value = !reportBugModalActive.value
}

const onFocus = () => {
  const accessToken = localStorage.getItem('ACCESS_TOKEN')

  const _logout = () => {
    usersStore.resetUser()
    // navigate to /dashboard
    if (!route || route.name !== 'Home') {
      router.push({ name: 'Home' })
    }
  }
  if (usersStoreToken.value && accessToken) {
    // logged in, verify token is still fresh
    if (checkExpiredToken()) {
      _logout()
    }
  } else if (usersStoreToken.value && !accessToken) {
    // logged out in another tab
    _logout()
  } else if (!usersStoreToken.value && accessToken) {
    // logged in in another tab
    keycloak.refreshTokenLoop.start()
  }
}

onMounted(() => {
  if (window?.socket?.connected) {
    socket.disconnect()
  }

  window.addEventListener('resize', fixTiptapTableHeight)

  // handle multiple tabs browsing for auth
  window.addEventListener('focus', onFocus)

  document.querySelector('.app-loader')?.classList.add('fade-out')
  setTimeout(() => {
    document.querySelector('.app-loader')?.remove()
  }, 200)
})

onBeforeUnmount(() => {
  // this.$refs.scrollview.removeEventListener('scroll', this.setDarkTopbar)
  window.removeEventListener('focus', onFocus)
  window.removeEventListener('resize', fixTiptapTableHeight)
})
</script>
<style lang="scss">
@import '@/design/scss/main';

#APP {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
  justify-content: stretch;

  .loader-backdrop {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    inset: 0;
    z-index: 99999999;
    cursor: wait;
    background-color: rgb(0 0 0 / 60%);
  }

  #scrollview {
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;

    .main-view {
      flex-grow: 1;
    }

    #footer {
      flex-shrink: 0;
    }
  }
}

#APP.notification {
  padding: 0; // overwrite buefy ".notification" style
}

.floating-chat-icon {
  position: fixed;
  top: calc(100vh - 8rem);
  top: calc(100dvh - 8rem);
  left: calc(100dvw - 5rem);
  transform: translateZ(0) translate(-100%, -50%);
  z-index: 1000;
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  background-color: $white;
  border: 3px solid $primary-dark;
  border-radius: 50px;
  color: $primary-dark;
  font-weight: bold;
  box-shadow: 4px 4px 6px 2px rgb(0 0 0 / 10%);
  padding: 0.5rem 1rem;
  transition: transform 0.2s ease-in-out;
  font-size: 1.2rem;
  white-space: nowrap;

  @media screen and (max-width: $med-tablet) {
    top: calc(100vh - 6rem);
    top: calc(100dvh - 6rem);
    left: calc(100dvw - 2rem);
    font-size: 0.8rem;
  }

  .chatbot-icon {
    width: 1.5rem;
    height: 1.5rem;
    fill: $primary-dark;
    border-radius: 50%;
    transform-origin: center;
    animation-name: pulse-scale;
    animation-duration: 3s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: 2;
    animation-delay: 2s;

    @media screen and (max-width: $med-tablet) {
      width: 1rem;
      height: 1rem;
    }
  }

  &:hover {
    transform: translateZ(0) translate(-100%, -50%) scale(1.05);
  }

  .chatbot-label {
    transform-origin: center;
    animation-name: wiggle;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: 12;
    animation-delay: 2s;
  }
}

@keyframes wiggle {
  0% {
    rotate: 0deg;
    translate: 0 0;
  }

  25% {
    rotate: -1deg;
    translate: -2px 0;
  }

  80% {
    rotate: 1deg;
    translate: 2px 0;
  }
}

@keyframes pulse-scale {
  0% {
    transform: translateZ(0) scale(1, 1) rotateX(0deg) rotateY(0deg);
  }

  10% {
    transform: translateZ(0) scale(1.3, 0.8) rotateX(20deg) rotateY(-10deg);
  }

  20% {
    transform: translateZ(0) scale(0.9, 1.4) rotateX(-15deg) rotateY(25deg);
  }

  30% {
    transform: translateZ(0) scale(1.5, 0.7) rotateX(30deg) rotateY(-20deg);
  }

  40% {
    transform: translateZ(0) scale(0.8, 1.2) rotateX(-25deg) rotateY(15deg);
  }

  50% {
    transform: translateZ(0) scale(1.2, 1.2) rotateX(10deg) rotateY(10deg);
  }

  60% {
    transform: translateZ(0) scale(1.4, 0.9) rotateX(-10deg) rotateY(-15deg);
  }

  70% {
    transform: translateZ(0) scale(1, 1.5) rotateX(20deg) rotateY(20deg);
  }

  80% {
    transform: translateZ(0) scale(1.1, 0.8) rotateX(-20deg) rotateY(-10deg);
  }

  90% {
    transform: translateZ(0) scale(1.3, 1.3) rotateX(10deg) rotateY(10deg);
  }

  100% {
    transform: translateZ(0) scale(1, 1) rotateX(0deg) rotateY(0deg);
  }
}
</style>
