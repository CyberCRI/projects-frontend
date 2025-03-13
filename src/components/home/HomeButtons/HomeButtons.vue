<template>
  <div class="home-buttons">
    <div class="home-btn-container">
      <LpiButton
        :label="$t('home.new-project')"
        secondary
        white-bg
        btn-icon="Plus"
        class="individual-button white-bg"
        data-test="create-project"
        @click="$router.push({ name: 'createProject' })"
      />

      <LpiButton
        v-if="organization.chat_button_text && organization.chat_url"
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

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'HomeButtons',

  components: { LpiButton },

  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },
  computed: {
    organization() {
      return this.organizationsStore.current
    },
  },

  methods: {
    goToChat() {
      window.open(this.organization.chat_url, '_blank')
    },
  },
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
