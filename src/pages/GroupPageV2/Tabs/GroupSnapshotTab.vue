<template>
  <!-- add new modules Here -->
  <div class="group-modules-list" data-test="group-modules">
    <GroupHeader :group="group" :is-loading="isLoading" />
    <GroupRecapPreview :group="group" />
    <div :class="['group-infos', group.modules.similars ? 'group-infos-children' : '']">
      <GroupDescriptionPreview v-if="group.$t.description" :group="group" />
      <GroupSimilarsPreview v-if="group.modules.similars" :group="group" :limit="3" />
    </div>
    <GroupMembersPreview v-if="groupModules.members" :group="group" :is-loading="isLoading" />
    <GroupProjectsPreview
      v-if="groupModules.featured_projects"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupSubPreview v-if="group.modules.subgroups" :group="group" :is-loading="isLoading" />
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
import GroupSubPreview from '@/components/group/Modules/GroupSub/GroupSubPreview.vue'
import GroupRecapPreview from '@/components/group/Modules/Extras/GroupRecapPreview.vue'
import GroupDescriptionPreview from '@/components/group/Modules/Extras/GroupDescriptionPreview.vue'
import GroupSimilarsPreview from '@/components/group/Modules/Extras/GroupSimilarsPreview.vue'
import GroupMembersPreview from '@/components/group/Modules/Members/GroupMembersPreview.vue'
import GroupProjectsPreview from '@/components/group/Modules/Projects/GroupProjectsPreview.vue'
import GroupDocumentsPreview from '@/components/group/Modules/Documents/GroupDocumentsPreview.vue'
import GroupHeader from '@/components/group/Modules/GroupHeader.vue'

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
      subgroups: 0,
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
}

.group-infos-children {
  gap: 1rem;
}

.group-infos:not(.group-infos-children) {
  grid-template-columns: 1fr;
}

@media screen and (max-width: $min-desktop) {
  .group-infos {
    grid-template-columns: 1fr;
  }
}
</style>
