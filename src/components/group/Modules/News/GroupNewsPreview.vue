<template>
  <BaseGroupPreview
    id="members"
    :title="$t(GroupModuleTitle.news)"
    :total="group.modules.news"
    icon="Users"
    :see-more="{ name: 'groupNews', params: { groupId: group.id } }"
  >
    <template #content>
      <div class="group-members">
        <BaseGroupNewsList
          :group="group"
          :is-loading="isLoading"
          class="contents"
          :with-pagination="false"
          focus-leader
        />
      </div>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import BaseGroupNewsList from '@/components/group/Modules/News/BaseGroupNewsList.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
</script>

<style lang="scss" scoped>
.group-members {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
