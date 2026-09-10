<script setup lang="ts">
import BaseProfileFiles from '~/components/profile/modules/Resources/BaseProfileFiles.vue'
import BaseProfileLink from '~/components/profile/modules/Resources/BaseProfileLink.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)
</script>

<template>
  <BaseProfileFiles
    v-if="profile?.modules?.files || editable"
    :profile="profile"
    :preview="preview"
    :editable="editable"
    :limit="limit"
  />
  <BaseProfileLink
    v-if="profile?.modules?.links || editable"
    :profile="profile"
    :preview="preview"
    :editable="editable"
    :limit="limit"
  />
</template>
