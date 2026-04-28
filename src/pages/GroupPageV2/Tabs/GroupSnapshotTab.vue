<template>
  <!-- add new modules Here -->
  <div class="group-modules-list" data-test="group-modules">
    <GroupHeader :group="group" :is-loading="isLoading" />
    <GroupRecapPreview :group="group" :modules="modulesRecap" is-link />
    <div class="group-infos">
      <GroupDescriptionPreview v-if="group.$t.description" :group="group" />
      <GroupSimilarsPreview v-if="group.modules.similars" :group="group" :limit="2" />
    </div>
    <GroupMembersPreview v-if="group.modules.members" :group="group" :is-loading="isLoading" />
    <GroupGalleryPreview v-if="group.modules.gallery" :group="group" :is-loading="isLoading" />
    <GroupSubPreview v-if="group.modules.subgroups" :group="group" :is-loading="isLoading" />
    <GroupProjectsPreview
      v-if="group.modules.featured_projects"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupLocationPreview v-if="group.modules.locations" :group="group" :is-loading="isLoading" />
    <GroupNewsPreview v-if="group.modules.news" :group="group" :is-loading="isLoading" />
    <GroupEventPreview v-if="group.modules.event" :group="group" :is-loading="isLoading" />
    <GroupDocumentsPreview
      v-if="group.modules.publications"
      document-type="publications"
      :group="group"
      :is-loading="isLoading"
    />
    <GroupDocumentsPreview
      v-if="group.modules.conferences"
      document-type="conferences"
      :group="group"
      :is-loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { PeopleGroupModulesKeys, TranslatedPeopleGroupModel } from '~/models/invitation.model'
import GroupSubPreview from '~/components/group/Modules/GroupSub/GroupSubPreview.vue'
import GroupRecapPreview from '~/components/group/Modules/Extras/GroupRecapPreview.vue'
import GroupDescriptionPreview from '~/components/group/Modules/Extras/GroupDescriptionPreview.vue'
import GroupSimilarsPreview from '~/components/group/Modules/Extras/GroupSimilarsPreview.vue'
import GroupMembersPreview from '~/components/group/Modules/Members/GroupMembersPreview.vue'
import GroupProjectsPreview from '~/components/group/Modules/Projects/GroupProjectsPreview.vue'
import GroupDocumentsPreview from '~/components/group/Modules/Documents/GroupDocumentsPreview.vue'
import GroupHeader from '~/components/group/Modules/GroupHeader.vue'
import GroupGalleryPreview from '~/components/group/Modules/Gallery/GroupGalleryPreview.vue'
import { difference } from 'es-toolkit'
import GroupNewsPreview from '~/components/group/Modules/News/GroupNewsPreview.vue'
import GroupEventPreview from '~/components/group/Modules/Event/GroupEventPreview.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isLoading?: boolean
  }>(),
  { isLoading: false }
)

// for recap we ignore similars
const IGNORED_KEYS: PeopleGroupModulesKeys[] = ['similars']
const GROUPS_KEYS = Object.keys(props.group.modules) as PeopleGroupModulesKeys[]
const modulesRecap = difference(GROUPS_KEYS, IGNORED_KEYS)
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
