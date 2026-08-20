<script setup lang="ts">
import type { ResearcherDocumentType, TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(
  defineProps<{
    user: TranslatedUserModel
    documentType: ResearcherDocumentType
    editable?: boolean
  }>(),
  { editable: false }
)
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE[documentType], user.modules[documentType])"
    :count="user.modules[documentType]"
  >
    <BaseModuleHeader :editable="editable" />

    {{ documentType }}
    {{ user.modules[documentType] }}
  </BaseModuleTab>
</template>
