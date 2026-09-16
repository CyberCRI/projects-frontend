<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import ContentExpandable from '@/components/base/ContentExpandable.vue'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t('profile.bio')"
    icon="Account"
    :see-more="{
      name: 'ProfileBio',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    <template #content>
      <ContentExpandable :description="user.$t.description" :height-limit="400" />
    </template>
  </BaseModulePreview>
</template>
