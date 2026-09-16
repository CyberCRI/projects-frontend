<script setup lang="ts">
import BaseProfileResources from '~/components/profile/modules/Resources/BaseProfileResources.vue'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.resources, user.modules.files + user.modules.links)"
    :icon="USER_MODULE_ICON.resources"
    :total="user.modules.files + user.modules.links"
    :see-more="{
      name: 'ProfileResources',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    <template #content>
      <div class="flat-resources">
        <BaseProfileResources :profile="user" preview :limit="3" />
      </div>
    </template>
  </BaseModulePreview>
</template>
<style lang="scss" scoped>
.flat-resources {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  .resource-container {
    display: contents !important;
  }
}
</style>
