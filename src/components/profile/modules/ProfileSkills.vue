<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.skills, user.modules.skills)"
    :icon="USER_MODULE_ICON.skills"
    :total="user.modules.skills"
    :see-more="{
      name: 'ProfileSkills',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    {{ user.modules.skills }}
  </BaseModulePreview>
</template>
