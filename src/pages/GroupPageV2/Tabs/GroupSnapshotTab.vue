<template>
  <!-- add new modules Here -->
  <div class="group-modules-list" data-test="group-modules">
    <GroupHeaderV2 :group="group" :is-loading="isLoading" />
    <GroupSubPreview v-if="group.children" :subgroups="group.children" :is-loading="isLoading" />
    <GroupRecapPreview :group="group" />
    <div :class="['group-infos', group.modules.similars ? 'group-infos-children' : '']">
      <GroupDescriptionPreview :group="group" />
      <GroupSimilarsPreview v-if="group.modules.similars" :group="group" />
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
import GroupRecapPreview from '@/components/group/Modules/GroupRecapPreview.vue'
import GroupSubPreview from '@/components/group/Modules/GroupSubPreview.vue'

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
  grid-template-columns: 3fr auto;
}

.group-infos-children {
  gap: 1rem;
}

@media screen and (max-width: $min-desktop) {
  .group-infos {
    grid-template-columns: 1fr;
  }
}
</style>
