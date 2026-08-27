<script setup lang="ts">
import BaseProfileGroupsList from '~/components/profile/modules/Groups/BaseProfileGroupsList.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.groups, user.modules.groups)"
    :count="user.modules.groups"
  >
    <BaseProfileGroupsList :profile="user" />
  </BaseModuleTab>
</template>
