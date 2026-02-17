<template>
  <div class="home-buttons" v-if="canCreateProject || hasChatButton">
    <div class="home-btn-container">
      <LpiButton
        v-if="canCreateProject"
        :label="$t('home.new-project')"
        secondary
        white-bg
        btn-icon="Plus"
        class="individual-button white-bg"
        data-test="create-project"
        @click="router.push({ name: 'createProject' })"
      />

      <LpiButton
        v-if="hasChatButton"
        :label="organization.chat_button_text"
        secondary
        white-bg
        class="individual-button white-bg"
        data-test="go-to-chat"
        no-text-transform
        @click="goToChat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations'

defineOptions({ name: 'HomeButtons' })
const organizationsStore = useOrganizationsStore()
const organization = computed(() => organizationsStore.current)

const hasChatButton = computed(
  () => organization.value?.chat_button_text && organization.value?.chat_url
)

const router = useRouter()

const { canCreateProject } = usePermissions()

const goToChat = () => {
  window.open(organization.value.chat_url, '_blank')
}
</script>

<style lang="scss" scoped>
.home-buttons {
  margin-top: $space-l;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: $space-l $space-s;
  border-radius: $border-radius-8;
  background-color: $primary-lighter;
}

.home-btn-container {
  display: flex;
  place-content: center center;
  gap: $space-xs;
}
</style>
