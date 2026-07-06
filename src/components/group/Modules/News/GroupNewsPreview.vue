<template>
  <BaseGroupPreview
    id="news"
    :title="$t(GROUP_MODULE_TITLE.news, group.modules.news)"
    :total="group.modules.news"
    :icon="GROUP_MODULE_ICON.news"
    :see-more="{
      name: 'groupNews',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <BaseGroupNewsList :group="group" :limit="6" preview />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
