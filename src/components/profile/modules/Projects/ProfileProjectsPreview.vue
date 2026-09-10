<script setup lang="ts">
import BaseProfileCategoriesFollower from '~/components/profile/modules/Projects/BaseProfileCategoriesFollower.vue'
import BaseProfileProjectsReviewer from '~/components/profile/modules/Projects/BaseProfileProjectsReviewer.vue'
import BaseProfileProjectsFollower from '~/components/profile/modules/Projects/BaseProfileProjectsFollower.vue'
import type { TranslatedUserModel, UserModulesKeys } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'
import type { ExtractKeys } from '~/interfaces/utils'

defineProps<{
  user: TranslatedUserModel
  type: ExtractKeys<
    UserModulesKeys,
    'projects' | 'follows_categories' | 'follows_projects' | 'reviews_projects'
  >
}>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE[type], user.modules[type])"
    :icon="USER_MODULE_ICON[type]"
    :total="user.modules[type]"
    :see-more="{
      name: 'ProfileProjects',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
      hash: `#${type}`,
    }"
  >
    <template #content>
      <BaseProfileProjectsMember v-if="type === 'projects'" :profile="user" preview :limit="5" />
      <BaseProfileProjectsReviewer
        v-else-if="type === 'reviews_projects'"
        :profile="user"
        preview
        :limit="5"
      />
      <BaseProfileProjectsFollower
        v-else-if="type === 'follows_projects'"
        :profile="user"
        preview
        :limit="5"
      />
      <BaseProfileCategoriesFollower
        v-else-if="type === 'follows_categories'"
        :profile="user"
        preview
        :limit="3"
      />
    </template>
  </BaseModulePreview>
</template>
