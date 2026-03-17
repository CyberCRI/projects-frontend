<template>
  <BaseGroupPreview
    id="news"
    :title="$t('group.news')"
    :total="group.modules.news"
    :icon="GroupModuleIcon.news"
    :see-more="{
      name: 'groupNews',
      params: { groupId: group.id },
    }"
  >
    <template #content>
      <BaseGroupNewsList :group="group" :with-pagination="false" :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleIcon, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()
</script>
