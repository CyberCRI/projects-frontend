<template>
  <BaseGroupPreview
    id="gallery"
    :title="$t(GroupModuleTitle.gallery, group.modules.gallery)"
    :total="group.modules.gallery"
    :icon="GroupModuleIcon.gallery"
  >
    <template #header>
      <SeeMoreArrow
        :to="{
          name: 'groupGallery',
          params: { groupIdOrSlug: group.slug || group.id },
        }"
      />
    </template>
    <template #content>
      <BaseGroupGallery :group="group" preview :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { GroupModuleIcon, GroupModuleTitle } from '~/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import BaseGroupGallery from '~/components/group/Modules/Gallery/BaseGroupGallery.vue'
import BaseGroupPreview from '~/components/group/Modules/BaseGroupPreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
