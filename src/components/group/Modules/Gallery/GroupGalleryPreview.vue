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
          params: { groupId: group.id },
        }"
      />
    </template>
    <template #content>
      <BaseGroupGallery :group="group" preview :limit="6" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
