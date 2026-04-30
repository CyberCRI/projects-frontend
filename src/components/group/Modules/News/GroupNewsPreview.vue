<template>
  <BaseGroupPreview
    id="news"
    :title="$t(GroupModuleTitle.news, group.modules.news)"
    :total="group.modules.news"
    :icon="GroupModuleIcon.news"
    :see-more="{
      name: 'groupNews',
      params: { groupIdOrSlug: group.slug || group.id },
    }"
  >
    <template #content>
      <BaseGroupNewsList :group="group" :with-pagination="false" :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'
import { GroupModuleIcon, GroupModuleTitle } from '@/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
