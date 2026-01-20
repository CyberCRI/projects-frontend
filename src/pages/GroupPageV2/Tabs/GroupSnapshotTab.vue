<template>
  <!-- add new modules Here -->
  <div class="group-modules-list" data-test="group-modules">
    <GroupHeaderV2 :group="group" :is-loading="isLoading" />
    <SubGroups v-if="group.children?.length" :subgroups="group.children" :is-loading="isLoading" />
    <div class="group-infos">
      <GroupDescriptionPreview :group="group" />
      <GroupSimilarsPreview :group="group" />
    </div>
    <GroupProjectsPreview
      v-if="groupModules.featured_projects"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupMembersPreview v-if="groupModules.members" :group="group" :is-loading="isLoading" />
    <GroupDocumentsPreview
      v-if="groupModules.publications"
      document-type="publications"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupDocumentsPreview
      v-if="groupModules.conferences"
      document-type="publications"
      :group="group"
      :is-loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import GroupProjectsPreview from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsPreview.vue'
import GroupMembersPreview from '@/pages/GroupPageV2/Tabs/Members/GroupMembersPreview.vue'
import GroupDocumentsPreview from '@/pages/GroupPageV2/Tabs/Documents/GroupDocumentsPreview.vue'
import GroupDescriptionPreview from '@/pages/GroupPageV2/Tabs/Extras/GroupDescriptionPreview.vue'
import GroupSimilarsPreview from '@/pages/GroupPageV2/Tabs/Extras/GroupSimilarsPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

// filters only modules with upper than zero elements
const groupModules = computed(() => {
  if (!props.group || !props.group.modules) {
    return {
      featured_projects: 0,
      members: 0,
      publications: 0,
      conferences: 0,
    }
  }
  return props.group.modules
})
</script>

<style lang="scss" scoped>
.group-modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.group-infos {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 1rem;
}
</style>
