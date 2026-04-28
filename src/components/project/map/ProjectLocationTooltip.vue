<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('project.view')"
    :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
    :image="project.header_image"
    :default-picture="DEFAULT_PROJECT_PATATOID"
    :title="project.$t.title"
    :description="project.$t.purpose ?? project.$t.description"
  />
</template>

<script setup lang="ts">
import type { TranslatedLocation } from '~/models/location.model'
import type { TranslatedProject } from '~/models/project.model'

import CardLocationTooltip from '~/components/map/CardLocationTooltip.vue'

import { DEFAULT_PROJECT_PATATOID } from '~/composables/usePatatoids'

defineProps<{ location: TranslatedLocation; project: TranslatedProject }>()
</script>
