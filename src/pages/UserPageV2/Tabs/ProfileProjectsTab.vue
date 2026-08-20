<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.projects, user.modules.projects)"
    :count="user.modules.projects"
  >
    <BaseModuleHeader :editable="editable" />
    {{ user.modules.projects }}
  </BaseModuleTab>
</template>
