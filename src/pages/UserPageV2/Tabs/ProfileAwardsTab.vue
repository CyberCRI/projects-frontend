<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.awardsTab, user.researcher?.modules?.awards)"
    :count="user.researcher?.modules?.awards"
  >
    <BaseResearcherAwards :user="user" />
  </BaseModuleTab>
</template>
