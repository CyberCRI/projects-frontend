<script setup lang="ts">
import BaseProfileCategoriesFollower from '~/components/profile/modules/Projects/BaseProfileCategoriesFollower.vue'
import BaseProfileProjectsReviewer from '~/components/profile/modules/Projects/BaseProfileProjectsReviewer.vue'
import BaseProfileProjectsFollower from '~/components/profile/modules/Projects/BaseProfileProjectsFollower.vue'
import BaseProfileProjectsMember from '~/components/profile/modules/Projects/BaseProfileProjectsMember.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{
  profile: TranslatedUserModel
}>()
</script>

<template>
  <BaseProfileProjectsMember :profile="profile" />
  <BaseProfileProjectsReviewer :profile="profile" />
  <BaseProfileProjectsFollower :profile="profile" />
  <BaseProfileCategoriesFollower :profile="profile" />
</template>
