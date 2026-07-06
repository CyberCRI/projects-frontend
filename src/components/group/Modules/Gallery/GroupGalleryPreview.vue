<template>
  <BaseGroupPreview
    id="gallery"
    :title="$t(GROUP_MODULE_TITLE.gallery, group.modules.gallery)"
    :total="group.modules.gallery"
    :icon="GROUP_MODULE_ICON.gallery"
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
import BaseGroupGallery from '@/components/group/Modules/Gallery/BaseGroupGallery.vue'
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
