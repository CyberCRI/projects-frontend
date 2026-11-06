<script setup lang="ts">
import BaseModulePreview from '~/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.awards, user?.researcher?.modules?.awards)"
    :icon="USER_MODULE_ICON.awards"
  >
    <template #content>
      <BaseResearcherAwards :user="user" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>
