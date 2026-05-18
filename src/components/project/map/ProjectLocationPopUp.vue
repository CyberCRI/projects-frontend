<template>
  <CardLocationPopUp
    :location="location"
    :label="$t('project.view')"
    :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
    :image="project.header_image"
    :default-picture="DEFAULT_PROJECT_PATATOID"
    :title="project.$t.title"
    :description="project.$t.purpose ?? project.$t.description"
  />
</template>

<script setup lang="ts" generic="T extends AnyTranslatedLocation">
import type CardLocationPopUp from '@/components/map/CardLocationPopUp.vue'
import { DEFAULT_PROJECT_PATATOID } from '@/composables/usePatatoids'
import type { AnyTranslatedLocation } from '@/models/location.model'
import type { TranslatedProject } from '@/models/project.model'

defineProps<{ location: T; project: TranslatedProject }>()
</script>
