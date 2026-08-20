<script setup lang="ts">
import type { ResearcherDocumentType, TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel; documentType: ResearcherDocumentType }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE[documentType], user.modules[documentType])"
    :icon="USER_MODULE_ICON[documentType]"
    :total="user.modules[documentType]"
    :see-more="{
      name: 'ProfileDocuments',
      params: {
        userIdOrSlug: user.slug || user.id,
        documentType: documentType,
      },
    }"
  >
    <template #content>
      {{ documentType }}
      {{ user.modules[documentType] }}
    </template>
  </BaseModulePreview>
</template>
