<script setup lang="ts">
import BaseProfileProjects from '~/components/profile/modules/Projects/BaseProfileProjects.vue'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.projects, user.modules.projects)"
    :icon="USER_MODULE_ICON.projects"
    :total="user.modules.projects"
    :see-more="{
      name: 'ProfileProjects',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    <template #content>
      <BaseProfileProjects :profile="user" preview :limit="3" />
    </template>
  </BaseModulePreview>
</template>
