<template>
  <!-- add new modules Here -->
  <div class="group-modules-list" data-test="group-modules">
    <GroupHeader :group="group" :is-loading="isLoading" />
    <GroupRecapPreview :group="group" is-link />
    <div class="group-infos">
      <GroupDescriptionPreview v-if="group.$t.description" :group="group" />
      <GroupSimilarsPreview v-if="group.modules.similars" :group="group" :limit="3" />
    </div>
    <GroupMembersPreview v-if="group.modules.members" :group="group" :is-loading="isLoading" />
    <GroupGalleryPreview
      v-if="group.modules.gallery || true"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupSubPreview v-if="group.modules.subgroups" :group="group" :is-loading="isLoading" />
    <GroupProjectsPreview
      v-if="group.modules.featured_projects"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupLocationPreview v-if="group.modules.locations" :group="group" :is-loading="isLoading" />
    <GroupDocumentsPreview
      v-if="group.modules.publications"
      document-type="publications"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupDocumentsPreview
      v-if="group.modules.conferences"
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
import GroupLocationPreview from '@/components/group/Modules/Locations/GroupLocationPreview.vue'
import GroupGalleryPreview from '@/components/group/Modules/Gallery/GroupGalleryPreview.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()
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

// merge all cols if only one child
.group-infos:has(> :only-child) {
  grid-template-columns: 1fr;
}

@media screen and (max-width: $min-desktop) {
  .group-infos {
    grid-template-columns: 1fr;
  }
}
</style>
