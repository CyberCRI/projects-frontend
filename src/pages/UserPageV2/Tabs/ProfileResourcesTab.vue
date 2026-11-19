<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.resources, user.modules, user.modules.files + user.modules.links)"
    :count="user.modules.files + user.modules.links"
  >
    <BaseProfileResources :profile="user" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProfileResources from '~/components/profile/modules/Resources/BaseProfileResources.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>
