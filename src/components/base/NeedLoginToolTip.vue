<template>
  <ToolTip :disabled="usersStore.isConnected" interactive placement="top">
    <template #custom-content>
      <p class="notice">
        {{ $t('common.need-login') }}
      </p>
      <p class="action">
        <LpiButton :label="$t('home.login')" :secondary="false" @click="keycloak.login" />
      </p>
    </template>
    <slot :need-login="!usersStore.isConnected" />
  </ToolTip>
</template>
<script setup lang="ts">
import LpiButton from '~/components/base/button/LpiButton.vue'
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'
import ToolTip from '~/components/base/ToolTip.vue'

import useUsersStore from '~/stores/useUserStore'

const usersStore = useUsersStore()
const keycloak = useKeycloak()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.notice {
  font-size: variables.$font-size-l;
  text-align: center;
  margin-bottom: 1rem;
}

.action {
  display: flex;
  justify-content: center;
}
</style>
