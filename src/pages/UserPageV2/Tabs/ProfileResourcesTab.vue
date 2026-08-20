<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.resources, user.modules, user.modules.files + user.modules.links)"
    :count="user.modules.files + user.modules.links"
  >
    <BaseModuleHeader :editable="editable" />
    {{ user.modules.files + user.modules.links }}
  </BaseModuleTab>
</template>
