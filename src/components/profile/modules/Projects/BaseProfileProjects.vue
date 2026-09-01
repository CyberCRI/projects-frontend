<script setup lang="ts">
import BaseProfileCategoriesFollower from '~/components/profile/modules/Projects/BaseProfileCategoriesFollower.vue'
import BaseProfileProjectsReviewer from '~/components/profile/modules/Projects/BaseProfileProjectsReviewer.vue'
import BaseProfileProjectsFollower from '~/components/profile/modules/Projects/BaseProfileProjectsFollower.vue'
import BaseProfileProjectsMember from '~/components/profile/modules/Projects/BaseProfileProjectsMember.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
  }>(),
  {
    limit: null,
    preview: false,
  }
)
</script>

<template>
  <BaseProfileProjectsMember :profile="profile" :limit="limit" :preview="preview" />
  <BaseProfileProjectsReviewer :profile="profile" :limit="limit" :preview="preview" />
  <BaseProfileProjectsFollower :profile="profile" :limit="limit" :preview="preview" />
  <BaseProfileCategoriesFollower :profile="profile" :limit="limit" :preview="preview" />
</template>
