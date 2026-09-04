<script setup lang="ts">
import BaseProfileGroupsList from '~/components/profile/modules/Groups/BaseProfileGroupsList.vue'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'
defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.groups, user.modules.groups)"
    :icon="USER_MODULE_ICON.groups"
    :total="user?.modules?.groups"
    :see-more="{
      name: 'ProfileGroups',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    <template #content>
      <BaseProfileGroupsList :profile="user" :limit="5" preview />
    </template>
  </BaseModulePreview>
</template>
