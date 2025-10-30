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
      <div class="floating-chat-icon">
        <LpiButton btn-icon="SparklingFill" @click="isChatBotOpen = true" />
      </div>
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
  () => !!useRuntimeConfig().public.appChatbotEnabled /* && usersStore.isConnected */
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
  display: inline-block;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}
</style>
