<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'
import BaseProfileGroupsList from '~/components/profile/modules/Groups/BaseProfileGroupsList.vue'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.groups, user.modules.groups)"
    :count="user.modules.groups"
  >
    <BaseModuleHeader :editable="editable" />
    <BaseProfileGroupsList :profile="user" />
  </BaseModuleTab>
</template>
